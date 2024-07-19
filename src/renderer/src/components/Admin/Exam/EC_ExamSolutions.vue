<script setup>
import { adminStore, globalStore } from "@/main.js";
import { computed } from "vue";
import { formatDateTime, formatTime } from "@/scripts/helpers.js";
const filteredSolutions = computed(() => {
	return adminStore.solutions.filter(u => 
    u.name.includes('json') && 
    (adminStore.filteredUsers.includes(u.name.slice(0,-5)) || !adminStore.userSolutionsMatchAccess) &&
    (u.name.includes(adminStore.userSolutionsEmailFilter) || adminStore.userSolutionsEmailFilter == ''))
});
const checkPoints = computed(() => {
    let sum = 0;
    for (const task of adminStore.selectedExam.groups[adminStore.selectedSolution.examData.exam_group].tasks) sum += task.taskPoints;
    return sum;
})

const markdownSolution = computed(() => {
    let html = adminStore.selectedSolution.examData.exam_solutions[adminStore.selectedTaskSolution].html_code;
    let js = adminStore.selectedSolution.examData.exam_solutions[adminStore.selectedTaskSolution].js_code;

    let md_html = html != '' ? `**HTML**\n\`\`\`html\n${html}\n\`\`\`` : ''
    let md_js = js != '' ? `**JAVASCRIPT**\n\`\`\`js\n${js}\n\`\`\`` : ''
    return `${md_html}\n${md_js}`
})
const checkPassword = computed( () => {
    if (adminStore.examPasswords[adminStore.selectedExam.id] != undefined) {
        return true
    }
    else {
        adminStore.fixExamPassword(adminStore.selectedExam.id, adminStore.selectedExam.password);
        return false
    }
})
</script>

<template>  
    <div class="flex wh-full gap-4 px-4 pb-2 overflow-auto" :class="!adminStore.selectedExamUpToDate ? 'cursor-not-allowed opacity-25' : ''">     
        <div class="flex flex-col min-w-72 max-w-72 h-full" :class="!adminStore.selectedExamUpToDate ? 'pointer-events-none' : ''">       
            <div class="flex-center p-4 whitespace-nowrap gap-2">
                <EC_Button @click="adminStore.fetchSolutions()" :disabled="adminStore.updating" :bg="adminStore.updating ? '' : 'blue'"
                    class="rounded-full aspect-square flex-center"
                    @mouseover="globalStore.setTooltip(`Dohvati rješenja`, 'top', 'text-center')"
                    @mouseleave="globalStore.setTooltip()"><i class="fa-solid fa-cloud-arrow-down"></i></EC_Button>
                <EC_Title>Korisnici - rješenja</EC_Title>
            </div>
            
            <div class="flex flex-col gap-2 py-2 justify-center" >
                <EC_InputLabel description="Query za dohvaćanje rješenja:" class="whitespace-nowrap -mt-4"/>
                <div class="flex gap-2">
                    <i class="fa-solid fa-circle-question mt-1.5" 
                        @mouseleave="globalStore.tooltip = { content: '', offsetx: 0, offsety: 0 }"
                        @mouseover="globalStore.tooltip =  { 
                            content: 'Šifra se koristi za dohvaćanje riješenih ispita sa Firebase-a',
                            offsetx: 0, offsety: -36,
                            justify: 'justify-center' 
                        }">
                    </i>
                    <EC_InputLabel title="Šifre ispita:" class="whitespace-nowrap"/>
                    <div class="w-full flex-center" v-if="checkPassword">
                        <EC_Dropdown v-model="adminStore.selectedSolutionPassword" class="grow"
                            :list="Object.keys(adminStore.examPasswords[adminStore.selectedExam.id])"/>
                    </div>
                </div>
                <div class="bg-neutral-500 w-full h-0.5 rounded"></div>
            </div>
            <div class="flex flex-col gap-2 py-2 justify-center">
                <EC_InputLabel description="Filtriranje dohvaćenih rješenja:" class="whitespace-nowrap -mt-4"/>
                <EC_CheckBox label="Koristi filter korisnika" v-model="adminStore.userSolutionsMatchAccess"/>
                <EC_Input class="h-6" placeholder="Email korisnika..." v-model="adminStore.userSolutionsEmailFilter"/>
                <EC_Button :disabled="filteredSolutions.length <= 0" :bg="filteredSolutions.length <= 0 ? '' : 'green'"
                    @click="adminStore.startBatchExamination()">
                    Batch examination
                </EC_Button>
            </div>

            <div class="w-full">
                <div class="bg-neutral-500 w-full h-1 rounded"></div>
            </div>
            <div class="flex flex-col py-2 justify-start items-start w-full h-full overflow-auto gap-1" :class="adminStore.updating ? 'cursor-progress opacity-50' : ''">
                <EC_UserSolution v-for="user, i in filteredSolutions" v-if="filteredSolutions.length > 0" :class="adminStore.updating ? 'pointer-events-none' : ''" :user="user" :i="i"/>
                <div class="text-neutral-500"> Nema rezultata ... </div>
            </div>
        </div>

        <div v-if="adminStore.selectedSolutionUrl != '' && adminStore.selectedSolution.examData && !adminStore.updating" class="flex flex-col gap-2 overflow-auto pr-2 wh-full" :class="!adminStore.selectedExamUpToDate ? 'pointer-events-none' : ''">     
            <div class="flex flex-col gap-2 pt-2">
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
                </div>
            </div>

            <!-- GRUPA -->
            <EC_InputLabel :title="`Grupa: <span class='text-sky-600'>${adminStore.selectedSolution.examData.exam_group}</span>`" description="" class="whitespace-nowrap" />
            <!-- ZADACI -->
            <EC_InputLabel title="Zadaci:" description="" class="whitespace-nowrap" />
            <div class="flex flex-wrap gap-2 w-full -mt-2">                
                <draggable :list="adminStore.selectedExam.groups[adminStore.selectedSolution.examData.exam_group].tasks" itemKey="id" class="flex flex-wrap gap-2"
                    v-if="adminStore.selectedExam.groups[adminStore.selectedSolution.examData.exam_group].tasks.length != 0">
                    <template #item="{ element, index }">                            
                        <div @click="adminStore.selectedTaskSolution = index; adminStore.awaitCodeCopy();" :class="adminStore.selectedTaskSolution == index ? 
                            'bg-sky-300 hover:bg-sky-200 dark:bg-sky-600 dark:hover:bg-sky-500' : 
                            'bg-gray-300 hover:bg-gray-200 dark:bg-slate-600 dark:hover:bg-slate-500'" 
                            class="hover:ring-1 relative text-sm min-w-8 aspect-square flex-center rounded cursor-pointer text-slate-900 dark:text-slate-50">
                            {{ index+1 }}
                        </div>
                    </template>
                </draggable>          
            </div>

            <!-- BODOVI -->
            <EC_InputLabel :title="`Ukupno bodova: <span class='text-sky-500 font-bold'>${checkPoints}</span>`" description=""/>

            <!-- MARKDOWN ZADATAK -->
            <!-- ZADATAK -->  
            <div class="grid grid-cols-1 w-full pr-2">
                <EC_InputLabel :title="`Zadatak | Bodovi: <span class='text-sky-600'>
                    ${adminStore.selectedExam.groups[adminStore.selectedSolution.examData.exam_group].tasks[adminStore.selectedTaskSolution].taskPoints}</span>`" 
                    description="" class="whitespace-nowrap" />
                <VueShowdown v-highlight class="mdSize text-left p-4 resize-vertical text-neutral-800 grow h-fit
                    dark:text-neutral-400 text-xs border rounded-md border-neutral-300 dark:border-neutral-700" 
                    :markdown="adminStore.selectedExam.groups[adminStore.selectedSolution.examData.exam_group].tasks[adminStore.selectedTaskSolution].taskText" 
                    flavor="github" :options="{ emoji: true }" 
                    :class="globalStore.isDarkMode ? 'md-dark bg-neutral-800' : 'md bg-white'" />
            </div>     
            <!-- RIJEŠENJE -->    
            <div class="grid grid-cols-1 w-full pr-2">
                <EC_InputLabel title="Riješenje"/>
                <VueShowdown v-highlight class="mdSize text-left p-4 resize-vertical text-neutral-800 grow h-fit
                    dark:text-neutral-400 text-xs border rounded-md border-neutral-300 dark:border-neutral-700" 
                    :markdown="markdownSolution" 
                    flavor="github" 
                    :options="{ emoji: true }" :class="globalStore.isDarkMode ? 'md-dark bg-neutral-800' : 'md bg-white'" />
            </div> 
        </div>

    </div>
</template>