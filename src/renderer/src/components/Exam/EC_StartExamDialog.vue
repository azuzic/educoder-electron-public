<template>
	<EC_PopupCard>
		<EC_Title> EduCoder </EC_Title>

		<EC_InputLabel class="mt-4" title="Ime" description="" />
		<EC_Input class="w-full bg-white" v-model="form.ime" type="text" name="ime" id="ime" autocomplete="ime" />
		<p class="text-rose-600 text-sm">{{ getFirstErrorForField(v$, "ime") }}</p>

		<EC_InputLabel class="mt-4" title="Prezime" description="" />
		<EC_Input class="w-full bg-white" v-model="form.prezime" type="text" name="prezime" id="prezime" autocomplete="prezime" />
		<p class="text-rose-600 text-sm">{{ getFirstErrorForField(v$, "prezime") }}</p>

		<EC_InputLabel class="mt-4" title="JMBAG" description="" />
		<EC_Input class="w-full bg-white" v-model="form.JMBAG" type="text" name="JMBAG" id="JMBAG" autocomplete="JMBAG" />
		<p class="text-rose-600 text-sm">{{ getFirstErrorForField(v$, "JMBAG") }}</p>

		<EC_InputLabel class="mt-4" title="Šifra zadatka" description="Dobivate ju od nastavnika koji provodi ispit." />
		<div class="flex gap-4 w-full items-start">
			<EC_Input v-model="form.password" class="w-full h-8" type="pasword" name="password" id="password" />
			<EC_Button @click="examStore.fetchExamDataFromFirestore(form.password)" :disabled="form.password==''" :bg="form.password=='' ? '' : 'blue'" class="py-2 px-4"> Dohvati </EC_Button>
		</div>

		<div class="mt-2" v-if="examStore.examSet">
			<b>Naslov:</b> {{ examStore.examData.title }} ({{ examStore.examData.course.name }})
			<br />
			<b>Vrsta zadatka: </b> {{ examStore.getExamDescription() }}
			<br />
			<b>Vrijeme rješavanja zadatka:</b> {{ examStore.examData.timeLimit!=0 ? examStore.examData.timeLimit : "neograničeno" }} min.
			<br />
			<b>Zadatak pripremio: </b> {{ examStore.examData.createdBy }}
			
			<b v-if="examStore.examData.accessTimeLimit.start!=0 || examStore.examData.accessTimeLimit.end!=0"><br />Pristup: </b> 

			<span v-if="examStore.examData.accessTimeLimit.start!=0"> {{ ' od ' }} </span>

			<span v-if="examStore.examData.accessTimeLimit.start!=0">
				{{ new Date(examStore.examData.accessTimeLimit.start).toLocaleDateString("hr") }}
				{{ new Date(examStore.examData.accessTimeLimit.start).toLocaleTimeString("hr") }}
			</span>

			<span v-if="examStore.examData.accessTimeLimit.end!=0"> {{ ' do ' }} </span>

			<span v-if="examStore.examData.accessTimeLimit.end!=0">
				{{ new Date(examStore.examData.accessTimeLimit.end).toLocaleDateString("hr") }}
				{{ new Date(examStore.examData.accessTimeLimit.end).toLocaleTimeString("hr") }} 
			</span>

			<span v-if="timeDifferenceStart">
				<br><b>Pristup ispitu se otvara za: </b>
				<b class="text-sky-600">{{ timeDifferenceStart }}</b>
			</span>
			<span v-else-if="timeDifferenceEnd">
				<br><b>Pristup ispitu se zatvara za: </b>
				<b class="text-rose-600">{{ timeDifferenceEnd }}</b>
			</span>
		</div>		
		<div class="flex justify-between mt-4">
			<div class="flex gap-2">
				<EC_Button class="py-2 px-4" :bg="!examStore.examSet || (!isInTime && !examStore.bypassTimeCheckEnabled) ? '' : 'green'" 
					:disabled="!examStore.examSet || (!isInTime && !examStore.bypassTimeCheckEnabled)" @click.prevent="startExam()"> 
					<span>Započni {{ examStore.examData.accessLimit ? 'ispit' : 'vježbu' }}</span>
				</EC_Button>
				<EC_Button v-if="examStore.examSet" class="py-2 px-4" :bg="examStore.examSet ? 'red' : ''" :disabled="!examStore.examSet" @click="examStore.clearExamData()"> Odustani </EC_Button>	
			</div>	
			<EC_Button class="py-2 px-4" :bg="!examStore.examSet ? 'blue' : ''" :disabled="examStore.examSet" @click="examStore.enterSandbox()"> Sandbox 🏖️ </EC_Button>
		</div>
	</EC_PopupCard>
</template>

<script setup>
import { onMounted, reactive, ref, watchEffect } from "vue";
import { examStore } from "@/main.js";

import { useVuelidate } from "@vuelidate/core";
import { required, helpers, numeric } from "@vuelidate/validators";
import { exactLength, getFirstErrorForField } from "@/scripts/validators";

const currentTime = ref(new Date());
const timeDifferenceStart = ref('');
const timeDifferenceEnd = ref('');
const isInTime = ref('');

	const calculateTimeDifferenceStart = () => {
	const diff = examStore.examData.accessTimeLimit.start - currentTime.value;
	const hours = Math.floor(diff / (1000 * 60 * 60));
	const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
	const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    const timeNotZero = hours > 0 || minutes > 0 || seconds > 0;
	if (timeNotZero) timeDifferenceStart.value = `${hours > 0 ? hours + " sati" : ''} ${minutes > 0 ? minutes + " minuta" : ''} ${seconds > 0 ? seconds + " sekundi" : ''}`;
	else timeDifferenceStart.value = false;
};

	const calculateTimeDifferenceEnd = () => {
	const diff = examStore.examData.accessTimeLimit.end - currentTime.value;
	const hours = Math.floor(diff / (1000 * 60 * 60));
	const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
	const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    const timeNotZero = hours > 0 || minutes > 0 || seconds > 0;
	if (timeNotZero) timeDifferenceEnd.value = `${hours > 0 ? hours + " sati" : ''} ${minutes > 0 ? minutes + " minuta" : ''} ${seconds > 0 ? seconds + " sekundi" : ''}`; 
	else timeDifferenceEnd.value = false;
};

const checkDateTime = () => {
	isInTime.value = (currentTime.value >= examStore.examData.accessTimeLimit.start-1000 || examStore.examData.accessTimeLimit.start == 0) && (currentTime.value <= examStore.examData.accessTimeLimit.end || examStore.examData.accessTimeLimit.end == 0)
};

const form = reactive({
	ime: "",
	prezime: "",
	JMBAG: "",
	password: "",
});

const rules = {
	ime: {
		required: helpers.withMessage("Polje je obavezno", required),
	},
	prezime: {
		required: helpers.withMessage("Polje je obavezno", required),
	},
	JMBAG: {
		required: helpers.withMessage("Polje je obavezno", required),
		numeric: helpers.withMessage("Polje smije sadržavati samo brojeve", numeric),
		exactLength: helpers.withMessage("JMBAG mora sadržavati točno 10 znamenki", exactLength(10)),
	},
};

const v$ = useVuelidate(rules, form);

onMounted(() => {
	if (!examStore.examInProgress)
		if (examStore.EDU_CODER_MODE != "SANDBOX")
			examStore.resetAndClear();
	
	const intervalId = setInterval(() => {
		currentTime.value = Date.now()
	}, 1000);

	watchEffect(() => {
		calculateTimeDifferenceStart();
		calculateTimeDifferenceEnd();
		checkDateTime();
	});
});

async function startExam() {
	const validationResult = await v$.value.$validate();
	if (!validationResult) return;

	if (confirm("Jeste li sigurni da želite započeti ispit? Uvijek provjerite jesu li učitani podaci ispravni.") === false) return;

	await examStore.startExam(form);
}
</script>
