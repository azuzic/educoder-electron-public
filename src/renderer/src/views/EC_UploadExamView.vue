<script setup>
import { globalStore, fileStore, adminStore } from "@/main.js";
import { computed } from "vue";
adminStore.fetchCreatedExams();
const checkForm = computed(() => {
	return !adminStore.updating && 
    fileStore.groups[fileStore.groupIndex].tasks.length != 0 && 
    !adminStore.createdExams.some(e => e.password == fileStore.exam.password) && 
    fileStore.exam.title != ''
});
const checkPoints = computed(() => {
    let sum = 0;
    for (const task of fileStore.groups[fileStore.groupIndex].tasks) sum += task.taskPoints;
    return sum;
})
</script>

<template> 
	<div class="flex-center w-full h-max min-h-max">
		<div class="flex flex-col w-full px-window transition-300">

            <!-- SUBJECT -->
			<EC_InputLabel title="Kolegij" description="Odaberite kolegij za koji želite učitati zadatak" />
			<EC_Dropdown
				v-model="fileStore.exam.course"
				labelName="name"
				:list="[
					{ name: 'Programiranje u skriptnim jezicima', code: 'PJS' },
					{ name: 'Programsko inženjerstvo', code: 'PI' },
				]" />

            <!-- TITLE -->
			<EC_InputLabel class="mt-4" title="Naziv zadatka" description="Unesite naziv zadatka koji će se prikazivati studentima" />
			<EC_Input v-model="fileStore.exam.title" type="text" name="title" id="title" autocomplete="title" />
            <span v-if="fileStore.exam.title == ''" class="text-rose-500 font-bold text-xs">Naziv ne smije biti prazan!</span>

            <!-- TIME LIMIT -->
			<EC_InputLabel class="mt-4" title="Vremensko ograničenje" description="Unesite vremensko ograničenje za rješavanje zadatka u <b>minutama</b>. <br> Za <b>neograničeno</b> vrijeme ostaviti <code class='text-sky-500 font-bold'>0</code>"/>
			<EC_NumberInput class="w-fit" :min="0" v-model="fileStore.exam.timeLimit"/>
            <span :class="fileStore.exam.timeLimit == '' ? 'opacity-100' : 'opacity-0'" 
                class="text-sky-500 font-bold text-sm transition-150 overflow-hidden">
                Neograničeno vrijeme!
            </span>

            <!-- TYPE -->
			<EC_InputLabel class="mt-4" title="Pristupno ograničenje" />
			<div class="flex gap-2 text-sm items-center dark:text-neutral-300 text-gray-800">
				<EC_CheckBox v-model="fileStore.exam.accessLimit" />
				<span v-if="!fileStore.exam.accessLimit">Zadatak je samo <b class="text-sky-500">vježba</b> (<i>neograničeni broj pokušaja</i>)</span>
				<span v-else>Zadatak je <b class="text-sky-500">ispit</b> (<i>samo 1 pokušaj</i>)</span>
			</div>            
            <div v-if="fileStore.exam.accessLimit" class="flex w-full gap-2 -mt-4">                
                <div class="flex flex-col grow">
                    <EC_InputLabel class="mt-4" title="" description="Početak pristupa ispitu"/>
                    <VueDatePicker :dark="globalStore.isDarkMode" v-model="fileStore.exam.accessTimeLimit.start"/>
                </div>
                <div class="flex flex-col grow">
                    <EC_InputLabel class="mt-4" title="" description="Kraj pristupa ispitu"/>
                    <VueDatePicker :dark="globalStore.isDarkMode" v-model="fileStore.exam.accessTimeLimit.end"/>
                </div>
            </div>
            <div v-if="fileStore.exam.accessLimit" class="dark:text-neutral-300 text-gray-800 mt-1">
                <span v-if="(fileStore.exam.accessTimeLimit.start != 0 && fileStore.exam.accessTimeLimit.start != null) || (fileStore.exam.accessTimeLimit.end != 0 && fileStore.exam.accessTimeLimit.end != null)">Pristup: </span> 
                <span v-else>Pristup: <b class="text-sky-600">bilokada</b></span>

                <b v-if="fileStore.exam.accessTimeLimit.start != 0 && fileStore.exam.accessTimeLimit.start != null"> {{ ' od ' }} </b>

                <span v-if="fileStore.exam.accessTimeLimit.start != 0 && fileStore.exam.accessTimeLimit.start != null" class="text-sky-600">
                    {{ new Date(fileStore.exam.accessTimeLimit.start).toLocaleDateString("hr") }}
                    {{ new Date(fileStore.exam.accessTimeLimit.start).toLocaleTimeString("hr") }}
                </span>

                <b v-if="fileStore.exam.accessTimeLimit.end != 0 && fileStore.exam.accessTimeLimit.end != null"> {{ ' do ' }} </b>

                <span v-if="fileStore.exam.accessTimeLimit.end != 0 && fileStore.exam.accessTimeLimit.end != null" class="text-rose-600">
                    {{ new Date(fileStore.exam.accessTimeLimit.end).toLocaleDateString("hr") }}
                    {{ new Date(fileStore.exam.accessTimeLimit.end).toLocaleTimeString("hr") }} 
                </span>
            </div>

            <!-- PASSWORD -->
			<div class="flex gap-4 w-full justify-start items-end">                
                <div class="flex flex-col grow">                    
                    <EC_InputLabel class="mt-4" title="Šifra zadatka" description="Unesite šifru zadatka putem koje će studenti pristupati točno ovom zadatku." />
                    <EC_Input v-model="fileStore.exam.password" class="w-full h-9" type="pasword" name="password" id="password" />
                </div>
                <div class="flex flex-col">                    
                    <EC_InputLabel class="mt-4" title="" description="Duljina šifre" />
                    <EC_NumberInput class="w-fit h-9" :min="1" :max="100" v-model="fileStore.passwordLength"/>
                </div>
				<EC_Button @click="fileStore.generatePassword" class="whitespace-nowrap h-9" bg="blue"> Generiraj šifru <i class="fa-solid fa-key"></i> </EC_Button>
			</div>
            <span v-if="adminStore.createdExams.some(e => e.password == fileStore.exam.password)"
                class="text-rose-500 font-bold text-xs">Ispit s istom šifrom već postoji!</span>

			<div class="flex flex-col gap-2 mb-4">
                
                <!-- GRUPE -->
                <EC_InputLabel title="Grupe:" description="" class="whitespace-nowrap" /> 
                <div class="flex flex-wrap gap-2 w-full -mt-2">
                    <EC_Button :disabled="fileStore.groups.length == 1" @click="fileStore.deleteSelectedGroup()" :bg="fileStore.groups.length == 1 ? '' : 'red'"
                        class="!text-sm min-w-8 aspect-square flex-center rounded cursor-pointer">
                        <i class="fa-solid fa-trash-can"></i>
                    </EC_Button>
                    <draggable :list="fileStore.groups" itemKey="id" class="flex flex-wrap gap-2" v-if="fileStore.groups.length != 0">
                        <template #item="{ element, index }">                            
                            <div @click="fileStore.selectGroup(index)" :class="fileStore.groupIndex == index ? 
                                'bg-sky-300 hover:bg-sky-200 dark:bg-sky-600 dark:hover:bg-sky-500' : 
                                'bg-gray-300 hover:bg-gray-200 dark:bg-slate-600 dark:hover:bg-slate-500'" 
                                class="hover:ring-1 relative text-sm min-w-8 aspect-square flex-center rounded cursor-pointer text-slate-900 dark:text-slate-50">
                                {{ index+1 }}
                            </div>
                        </template>
                    </draggable>
                    <EC_Button @click="fileStore.groups.push({tasks: [ '' ]})" bg="green"
                        class="!text-sm min-w-8 aspect-square flex-center rounded cursor-pointer">
                        <i class="fa-solid fa-plus"></i>
                    </EC_Button>
                </div>  
                
                <!-- ZADACI -->
                <EC_InputLabel title="Zadaci:" description="" class="whitespace-nowrap" />
                <div class="flex flex-wrap gap-2 w-full -mt-2">
                    <EC_Button :disabled="fileStore.groups[fileStore.groupIndex].tasks.length == 1" @click="fileStore.deleteSelectedTask()" :bg="fileStore.groups[fileStore.groupIndex].tasks.length == 1 ? '' : 'red'"
                        class="!text-sm min-w-8 aspect-square flex-center rounded cursor-pointer">
                        <i class="fa-solid fa-trash-can"></i>
                    </EC_Button>
                    <draggable :list="fileStore.groups[fileStore.groupIndex].tasks" itemKey="id" class="flex flex-wrap gap-2" v-if="fileStore.groups[fileStore.groupIndex].tasks.length != 0">
                        <template #item="{ element, index }">                            
                            <div @click="fileStore.taskIndex = index" :class="fileStore.taskIndex == index ? 
                                'bg-sky-300 hover:bg-sky-200 dark:bg-sky-600 dark:hover:bg-sky-500' : 
                                'bg-gray-300 hover:bg-gray-200 dark:bg-slate-600 dark:hover:bg-slate-500'" 
                                class="hover:ring-1 relative text-sm min-w-8 aspect-square flex-center rounded cursor-pointer text-slate-900 dark:text-slate-50">
                                {{ index+1 }}
                            </div>
                        </template>
                    </draggable>
                    <EC_Button @click="fileStore.groups[fileStore.groupIndex].tasks.push( {taskPoints: 0, taskText: ''} )" bg="green"
                        class="!text-sm min-w-8 aspect-square flex-center rounded cursor-pointer">
                        <i class="fa-solid fa-plus"></i>
                    </EC_Button>
                </div>   

                <!-- BODOVI -->
                <EC_InputLabel title="Bodovi zadatka:" description="" class="whitespace-nowrap" />
                <div class="flex gap-2 items-center">
                    <EC_NumberInput class="w-fit -mt-2" :min="0" v-model="fileStore.groups[fileStore.groupIndex].tasks[fileStore.taskIndex].taskPoints"/>
                    <EC_InputLabel :title="`Ukupno bodova: <code class='text-sky-500 font-bold'>${checkPoints}</code>`" description=""/>
                </div>
                
                <!-- MARKDOWN ZADATAK -->
                <div class="flex gap-2 resize-vertical !min-h-36 pr-2 h-36">          
                    <div class="flex flex-col max-w-[50%] min-w-[50%] h-full min-h-36">
                        <EC_InputLabel title="Edit"/>
                        <EC_TextArea class="wh-full text-left p-4 overflow-scroll text-neutral-800 resize-none
                            dark:text-neutral-400 text-xs" 
                            v-model="fileStore.groups[fileStore.groupIndex].tasks[fileStore.taskIndex].taskText"/>
                    </div>     
                    <div class="flex flex-col max-w-[50%] min-w-[50%] h-full min-h-36">
                        <EC_InputLabel title="Preview"/>
                        <VueShowdown v-highlight class="mdSize wh-full text-left p-4 overflow-scroll text-neutral-800  
                            dark:text-neutral-400 text-xs border rounded-md border-neutral-700" 
                            :markdown="fileStore.groups[fileStore.groupIndex].tasks.length != 0 ? 
                            (fileStore.groups[fileStore.groupIndex].tasks ? fileStore.groups[fileStore.groupIndex].tasks[fileStore.taskIndex].taskText : '') : ''" 
                            flavor="github" :options="{ emoji: true }" 
                            :class="globalStore.isDarkMode ? 'md-dark bg-neutral-800' : 'md bg-white'" />
                    </div>     
                </div>
                
            </div>

			<div class="flex gap-4">
				<input type="file" id="fileUpload" @change="fileStore.uploadFile" accept=".txt,.md" class="hidden" />
				<EC_Button @click="fileStore.openFileInput" bg="blue" class="w-full py-2"> Učitaj datoteku <i class="fa-solid fa-arrow-up-from-bracket"></i> </EC_Button>
			</div>

			<EC_Button class="mt-4 py-2 px-4" :bg="checkForm ? 'green' : ''" 
				:disabled="!checkForm" 
				@click.prevent="fileStore.createNewExam()"> {{ !fileStore.exam.accessLimit ? "Izradi vježbu" : "Izradi ispit" }} <i class="fa-solid fa-plus"></i> </EC_Button>
		</div>
	</div>
</template>
