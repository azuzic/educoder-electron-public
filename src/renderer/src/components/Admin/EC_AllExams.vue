<script setup>
import { adminStore, globalStore } from "@/main.js";
import { computed } from "vue";
function filterByTitle(exam) {
    return exam.title.toLowerCase().includes(adminStore.examTitleFilter.toLowerCase()) || adminStore.examTitleFilter == '';
};

function filterByPassword(exam) {
    return exam.password.toLowerCase().includes(adminStore.examPasswordFilter.toLowerCase()) || adminStore.examPasswordFilter == '';
};

function filterByID(exam) {
    return exam.id.toLowerCase().includes(adminStore.examIDFilter.toLowerCase()) || adminStore.examIDFilter == '';
};

function filterByAccessLimit(exam) {
    return exam.accessLimit === adminStore.examAccessFilter || adminStore.examAccessFilter === 'sve';
};

function filterByCourseCode(exam) {
    return exam.courseCode === adminStore.examClassFilter || adminStore.examClassFilter === 'sve';
};
const filteredExams = computed(() => {
    return adminStore.createdExams.filter(e => filterByTitle(e) && filterByPassword(e) && filterByID(e) && filterByAccessLimit(e) && filterByCourseCode(e));
});
</script>

<template>
    <EC_AdminPanel>                 
        <div class="flex-center gap-2 p-4 whitespace-nowrap">
            <EC_Button @click="adminStore.fetchCreatedExams()" :disabled="adminStore.updating" :bg="adminStore.updating ? '' : 'blue'"
                class="rounded-full aspect-square flex-center"
                @mouseover="globalStore.setTooltip(`Dohvati ispite`, 'top', 'text-center')"
                @mouseleave="globalStore.setTooltip()"><i class="fa-solid fa-cloud-arrow-down"></i></EC_Button>
            <EC_Title>Svi ispiti</EC_Title>
        </div>
        <EC_InputLabel description="Filtriranje dohvaćenih ispita:" class="whitespace-nowrap px-4 -mt-2"/>
        <div class="flex gap-2 px-4 justify-center">
            <EC_Input class="h-6 w-1/2" placeholder="Naslov ispita..." v-model="adminStore.examTitleFilter"/>
            <EC_Input class="h-6 w-1/2" placeholder="Šifra ispita..." v-model="adminStore.examPasswordFilter"/>
        </div>
        <div class="flex gap-2 px-4 mt-2 justify-center">
            <EC_Input class="h-6 w-full" placeholder="ID ispita..." v-model="adminStore.examIDFilter"/>
        </div>
        <div class="flex gap-2 px-4 justify-center">
            <div class="flex gap-2">
                <EC_InputLabel title="Ispit:" class="whitespace-nowrap"/>
                <EC_Dropdown v-model="adminStore.examAccessFilter" class="grow"
                    :list="[true, false, 'sve']"/>
            </div>
            <div class="flex gap-2">
                <EC_InputLabel title="Kolegij:" class="whitespace-nowrap"/>
                <EC_Dropdown v-model="adminStore.examClassFilter" class="grow"
                    :list="['PJS', 'PI', 'sve']"/>
            </div>
        </div>
        <div class="w-full px-4">
            <div class="bg-neutral-500 w-full h-1 rounded"></div>
        </div>
        <div class="flex flex-col py-2 px-4 justify-start items-start wh-full overflow-auto gap-1" :class="adminStore.updating ? 'cursor-progress opacity-50' : ''">
            <EC_ExamData v-for="exam, i in filteredExams" :class="adminStore.updating ? 'pointer-events-none' : ''" v-if="filteredExams.length > 0" :exam="exam" :i="i"/>
            <div class="text-neutral-500" v-else> Nema rezultata ... </div>
        </div>
    </EC_AdminPanel>
</template>