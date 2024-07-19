<script setup>
import { examStore, fileStore, globalStore, adminStore } from "@/main.js";
import { formatDateTime, formatTime } from "@/scripts/helpers.js";
import EC_Timer from "@/components/Exam/EC_Timer.vue";
</script>

<template>
	<div class="bg-neutral-200 dark:bg-neutral-950 pr-16 pl-16 flex items-center gap-1 py-2 text-xs">

        <div class="flex flex-wrap grow items-center gap-1 text-xs">
            <i class="fa-solid fa-sliders window-button scale-125 active:scale-100 transition-100 mr-1" @click="globalStore.showSettings = !globalStore.showSettings"></i>
            <EC_Button @click="globalStore.resetLayout"> Resetiraj sučelje </EC_Button>
            <EC_Button @click="globalStore.copyHTMLTemplateToClipboard"> Kopiraj HTML template </EC_Button>
            <span class="dark:text-neutral-400 text-neutral-600">Maksimalni dozvoljeni broj iteracija:</span>
            <EC_Dropdown v-model="examStore.options.maxIterations" class="w-14 z-50" :label="examStore.options.maxIterations" :list="['100', '250', '500', '1000', '1500', '2000', '5000']" />
            <EC_Dropdown v-model="examStore.options.evaluator" class="w-14 z-50" :label="examStore.options.evaluator" :list="['javascript', 'python', 'c_cpp']" />
            <span class="dark:text-neutral-400 text-neutral-600">Automatska evaluacija:</span>
            <EC_CheckBox v-model="examStore.options.autoEvaluation" />
            <EC_Button v-if="!examStore.options.autoEvaluation" bg="blue" @click.prevent="!examStore.evaluateCode()"> Evaluiraj kod (CTRL/CMD + Enter) <i class="fa-regular fa-circle-play ml-2"></i> </EC_Button>
        </div>

		<div v-if="examStore.EDU_CODER_MODE === 'SANDBOX'" class="flex items-start gap-1">
			<EC_Button bg="red" class="whitespace-nowrap w-32" @click="examStore.resetAndClear()"> Izađi iz Sandboxa <i class="fa-solid fa-right-from-bracket"></i></EC_Button>
			<EC_Button bg="green" class="whitespace-nowrap w-32" @click="examStore.downloadCode()"> Preuzmi rješenje <i class="fa-solid fa-download"></i> </EC_Button>
		</div>
        <div v-if="$route.name == 'Batch Examination'" class="flex items-start gap-1">
			<EC_Button bg="red" class="whitespace-nowrap w-32" @click="adminStore.exitExamination()"> Izađi iz ocjenjivanja <i class="fa-solid fa-right-from-bracket"></i></EC_Button>
			<EC_Button bg="green" class="whitespace-nowrap w-32" @click="fileStore.downloadExcel()"> Preuzmi Excel <i class="fa-solid fa-download"></i> </EC_Button>
			<EC_Button bg="green" class="whitespace-nowrap w-32" @click="fileStore.downloadJSON()"> Preuzmi JSON <i class="fa-solid fa-download"></i> </EC_Button>
		</div>

	</div>
	<div v-if="(examStore.examSet && examStore.examInProgress) || $route.name=='Batch Examination'" class="bg-neutral-100 dark:bg-neutral-900/50 flex flex-wrap items-center pl-16 gap-2 py-2 text-xs">
		<EC_Dropdown v-model="examStore.solutions[examStore.currentSolution - 1].status" class="w-24 whitespace-nowrap z-50" :label="examStore.solutions[examStore.currentSolution - 1].status" :list="['Nije započet', 'U tijeku', 'Završen']" />
		<span class="text-xl font-bold dark:text-neutral-400 text-neutral-600">Zadaci: </span>

        <div v-if="$route.name != 'Batch Examination'" v-for="task in examStore.solutions" @click="examStore.selectTask(task.id)"
			class="w-8 aspect-square rounded flex-center text-sm font-bold bg-opacity-75 dark:bg-opacity-60 hover:scale-95 hover:brightness-105 transition-150 cursor-pointer text-black dark:text-white"
			:class="[{ 'border-2 border-black dark:border-white': examStore.currentSolution == task.id }, { 'bg-rose-500 dark:bg-rose-600': task.status == 'Nije započet' }, { 'bg-amber-500 dark:bg-amber-500': task.status == 'U tijeku' }, { 'bg-green-500 dark:bg-green-600': task.status == 'Završen' }]">
			{{ task.id }}
		</div>
        <div v-else v-for="task in examStore.solutions" @click="examStore.selectTask(task.id)"
			class="w-8 aspect-square rounded flex-center font-bold bg-opacity-75 dark:bg-opacity-60 hover:scale-95 hover:brightness-105 transition-150 cursor-pointer text-black dark:text-white flex flex-col"
			:class="[{ 'border-2 border-black dark:border-white': examStore.currentSolution == task.id }, { 'bg-rose-500 dark:bg-rose-600': task.status == 'Nije započet' }, { 'bg-amber-500 dark:bg-amber-500': task.status == 'U tijeku' }, { 'bg-green-500 dark:bg-green-600': task.status == 'Završen' }]">
			<div class=" text-xs">
                {{ task.id }}
            </div>
            <div class="text-xs" v-if="adminStore.batchSolutions[adminStore.batchIndex]">
                {{ adminStore.batchSolutions[adminStore.batchIndex].examData.exam_solutions[task.id-1].points }}/{{examStore.examMarkdownContent[task.id-1].taskPoints}}
            </div>
		</div>
        <div v-if="$route.name == 'Batch Examination' && adminStore.batchSolutions[adminStore.batchIndex]" class="flex grow flex-col gap-2">
            <div class="flex gap-2">
                <div class="text-neutral-600 dark:text-neutral-400">
                    Ispit započet u <i class="text-green-600"> {{
                        adminStore.selectedSolution.examData.exam_duration != null ? adminStore.selectedSolution.examData.exam_start :
                        formatDateTime(adminStore.selectedSolution.examData.exam_start)
                        }}</i>
                    završen u <i class="text-rose-600"> {{
                        adminStore.selectedSolution.examData.exam_duration != null ? adminStore.selectedSolution.examData.exam_end :
                        formatDateTime(adminStore.selectedSolution.examData.exam_end)
                        }}</i>
                    u trajanju od <i class="text-sky-600"> {{
                        adminStore.selectedSolution.examData.exam_duration != null ? adminStore.selectedSolution.examData.exam_duration :
                        formatTime(adminStore.selectedSolution.examData.exam_end-adminStore.selectedSolution.examData.exam_start)
                    }}</i>
                </div>
                <div class="text-neutral-600 dark:text-neutral-400">
                    Ime i prezime: <i class="text-sky-600"> {{adminStore.selectedSolution.examData.form.ime + ' ' + adminStore.selectedSolution.examData.form.prezime}}</i>
                    JMBAG: <i class="text-sky-600"> {{adminStore.selectedSolution.examData.form.JMBAG}}</i>
                    Grupa: <i class="text-sky-600"> {{adminStore.selectedSolution.examData.exam_group}}</i>
                </div>
            </div>
            <div class="flex grow gap-1 text-sm placeholder:text-gray-400 dark:placeholder:text-neutral-500 text-gray-900 dark:text-neutral-400">
                Bodovi:
                <EC_NumberInput class="w-12 h-5" :min="0" :max="examStore.examMarkdownContent[examStore.currentSolution - 1].taskPoints"
                    v-model="adminStore.batchSolutions[adminStore.batchIndex].examData.exam_solutions[examStore.currentSolution - 1].points"/>
                /
                <span class="rounded-md border-0 py-1.5 pl-3 bg-gray-50 dark:bg-neutral-800 wh-full shadow-sm ring-1 ring-inset w-12 h-5 cursor-not-allowed
                    ring-gray-300 dark:ring-neutral-700 outline-none sm:text-sm sm:leading-6 flex items-center">
                    {{ examStore.examMarkdownContent[examStore.currentSolution - 1].taskPoints }}
                </span>
                Ukupno:
                <span class="rounded-md border-0 py-1.5 pl-3 bg-gray-50 dark:bg-neutral-800 wh-full shadow-sm ring-1 ring-inset w-12 h-5 cursor-not-allowed
                    ring-gray-300 dark:ring-neutral-700 outline-none sm:text-sm sm:leading-6 flex items-center">
                    {{ adminStore.batchSolutions[adminStore.batchIndex].examData.exam_solutions.reduce((acc, solution) => acc + solution.points, 0) }}
                </span>
                /
                <span class="rounded-md border-0 py-1.5 pl-3 bg-gray-50 dark:bg-neutral-800 wh-full shadow-sm ring-1 ring-inset w-12 h-5 cursor-not-allowed
                    ring-gray-300 dark:ring-neutral-700 outline-none sm:text-sm sm:leading-6 flex items-center">
                    {{ examStore.examMarkdownContent.reduce((acc, solution) => acc + solution.taskPoints, 0) }}
                </span>
                <div class="flex grow gap-1">
                    Komentar: <EC_TextArea class="grow h-8" v-model="adminStore.batchSolutions[adminStore.batchIndex].examData.exam_solutions[examStore.currentSolution - 1].comment"/>
                </div>
                <div class="flex gap-4">
                    <input type="file" id="fileUpload" @change="fileStore.uploadExaminationFile" accept=".txt,.md" class="hidden" />
                    <EC_Button @click="fileStore.openFileInput" bg="blue" class="h-8 py-2"> Učitaj MD ispit <i class="fa-solid fa-arrow-up-from-bracket"></i> </EC_Button>
                </div>
                <div class="flex gap-4">
                    <input type="file" id="fileUploadJSON" @change="fileStore.loadJSON" accept=".txt,.json" class="hidden" />
                    <EC_Button @click="fileStore.openFileInputJSON" bg="blue" class="h-8 py-2"> Učitaj JSON ispravljeno <i class="fa-solid fa-arrow-up-from-bracket"></i> </EC_Button>
                </div>
            </div>
        </div>

		<div class="grow flex justify-end pr-4">
			<EC_Button v-if="examStore.examInProgress" bg="text-slate-200 bg-rose-600 hover:bg-rose-500 dark:bg-rose-800 dark:hover:bg-sky-700 py-2 px-5" @click.prevent="examStore.endExam({ requireConfirmation: true })"> Završi ispit </EC_Button>
		</div>
	</div>
	<EC_Timer v-if="examStore.EDU_CODER_MODE != 'IDLE' && $route.name!='Batch Examination'" />
</template>
