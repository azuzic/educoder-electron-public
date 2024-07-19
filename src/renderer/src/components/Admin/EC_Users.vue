<script setup>
import { adminStore, globalStore } from "@/main.js";
import { computed } from "vue";

function filterByPassword(user) {
        return user.acessedExams.some(e => e.password.toLowerCase().includes(adminStore.userExamPasswordFilter.toLowerCase())) || adminStore.userExamPasswordFilter == '';
    };

function filterByTitle(user) {
    return user.acessedExams.some(e => {
        const filteredExam = adminStore.createdExams.find(c => c.id == e.id);
        return filteredExam ? filteredExam.title.toLowerCase().includes(adminStore.userExamTitleFilter.toLowerCase()) : false;
    }) || adminStore.userExamTitleFilter == '';
};

function filterByEmail(user) {
    return user.email.includes(adminStore.userEmailFilter) || adminStore.userEmailFilter == '';
};

function filterByAccessedExams(user, start, end) {
    return user.acessedExams.some(e => {
        return ((e.accessed > start && e.accessed !== undefined) || start === true) && 
                ((e.accessed < end && e.accessed !== undefined) || end === true);
    }) || (start === true && end === true);
};

const filteredUsers = computed(() => {
    const time = (date) => Math.floor(new Date(date).getTime());
    const start = adminStore.userStartDateFilter == null || adminStore.userStartDateFilter == undefined ? true : time(adminStore.userStartDateFilter);
    const end = adminStore.userEndDateFilter == null || adminStore.userEndDateFilter == undefined  ? true : time(adminStore.userEndDateFilter);    

    const filtered = adminStore.users.filter(u => filterByPassword(u) && filterByTitle(u) && filterByEmail(u) && filterByAccessedExams(u, start, end));

    adminStore.filteredUsers = filtered.map(user => user.email);

    return filtered;
});
</script>


<template>
    <EC_AdminPanel class="z-50">            
        <div class="flex-center gap-2 p-4 whitespace-nowrap">
            <EC_Button @click="adminStore.fetchUsers()" :disabled="adminStore.updating" :bg="adminStore.updating ? '' : 'blue'"
                class="rounded-full aspect-square flex-center"
                @mouseover="globalStore.setTooltip(`Dohvati korisnike`, 'top', 'text-center')"
                @mouseleave="globalStore.setTooltip()"><i class="fa-solid fa-cloud-arrow-down"></i></EC_Button>
            <EC_Title>Korisnici</EC_Title>
        </div>
        
            
        <div class="flex flex-col px-4 justify-center">
            <EC_InputLabel description="Query za dohvaćanje korisnika:" class="whitespace-nowrap -mt-4"/>
            <div class="flex gap-2 z-50 -mt-1">
                <EC_InputLabel title="Vrsta korisnika:" class="whitespace-nowrap"/>
                <EC_Dropdown v-model="adminStore.userTypeQuery" class="grow"
                    :list="['online', 'redovan', 'sve', 'ostalo']"/>
            </div>
            <div class="flex gap-2 -mt-1">
                <EC_InputLabel title="Kolegij:" class="whitespace-nowrap"/>
                <EC_Dropdown v-model="adminStore.userClassQuery" class="grow"
                    :list="['PJS', 'PI', 'sve', 'ostalo']"/>
            </div>
            <div class="flex-center gap-2 mt-0.5">
                <EC_Input class="h-6 grow" placeholder="Email korisnika..." v-model="adminStore.userEmailQuery"/>
                <i class="fa-solid fa-circle-question" 
                    @mouseleave="globalStore.tooltip = { content: '', offsetx: 0, offsety: 0 }"
                    @mouseover="globalStore.tooltip =  { 
                        content: 'Gleda početak stringa!',
                        offsetx: 0, offsety: -36,
                        justify: 'justify-center' 
                    }">
                </i>
            </div>
            <div class="bg-neutral-500 w-full my-2 h-0.5 rounded"></div>
        </div>

        <EC_InputLabel description="Filtriranje dohvaćenih korisnika:" class="whitespace-nowrap px-4 -mt-2"/>
        <div class="flex gap-2 pb-2 px-4 justify-center">
            <EC_Input class="h-6 w-1/2" placeholder="Email korisnika..." v-model="adminStore.userEmailFilter"/>
            <EC_Input class="h-6 w-1/2" placeholder="Šifra ispita..." v-model="adminStore.userExamPasswordFilter"/>
        </div>
        <div class="flex gap-2 pb-2 px-4 justify-center">
            <EC_Input class="h-6 w-full" placeholder="Naslov ispita..." v-model="adminStore.userExamTitleFilter"/>
            </div>
        <div class="flex gap-2 pb-2 px-4 justify-center">
            <VueDatePicker :dark="globalStore.isDarkMode" v-model="adminStore.userStartDateFilter"/>
            <VueDatePicker :dark="globalStore.isDarkMode" v-model="adminStore.userEndDateFilter"/>
        </div>
        <div class="flex gap-2 pb-2 px-4 justify-start">
            Broj korisnika: <b class="text-sky-600">{{ filteredUsers.length }}</b>
            <EC_CheckBox label="Prosiri Sve" v-model="adminStore.expandAllUsers"/>
        </div>
        <div class="w-full px-4">
            <div class="bg-neutral-500 w-full h-1 rounded"></div>
        </div>
        <div class="flex flex-col px-4 py-2 justify-start items-start wh-full overflow-auto gap-1" :class="adminStore.updating ? 'cursor-progress' : ''">
            <EC_UserData v-for="user, i in filteredUsers" :class="adminStore.updating ? 'pointer-events-none' : ''" v-if="filteredUsers.length > 0" :user="user" :i="i"/>
            <div class="text-neutral-500" v-else> Nema rezultata ... </div>
        </div>
    </EC_AdminPanel>
</template>