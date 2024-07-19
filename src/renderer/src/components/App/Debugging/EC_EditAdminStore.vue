<script setup>
import { globalStore, adminStore } from "@/main.js";
</script>

<template>
    <div v-if="globalStore.storeSelected == 'adminStore'" class="flex flex-col gap-0.5 text-sm"> 
        <EC_Button class="w-48" bg="red" @click="adminStore.RESET_TO_DEFAULT_VALUES()"> RESET_TO_DEFAULT_VALUES </EC_Button>
        <div class="flex items-center gap-2">
            <EC_CheckBox v-model="adminStore.updating" label="updating"/>
        </div>
        <div class="flex items-center gap-2">
            <EC_CheckBox v-model="adminStore.editing" label="editing"/>
        </div>
        
        <div class="bg-neutral-500 h-0.5 w-full my-1 rounded-full"></div>
        <!--USERS-->
        USERS:
        <div class="flex items-center gap-2">
            <EC_Input class="w-48 h-5 rounded" v-model="adminStore.userEmailQuery" />
            userEmailQuery
        </div>
        <div class="flex gap-2">
            <EC_Dropdown v-model="adminStore.userTypeQuery" class="w-48"
                :list="['online', 'redovan', 'sve', 'ostalo']"/>
                userTypeQuery
        </div>
        <div class="flex gap-2">
            <EC_Dropdown v-model="adminStore.userClassQuery" class="w-48"
                :list="['PJS', 'PI', 'sve', 'ostalo']"/>
                userClassQuery
        </div>
        <div class="flex items-center gap-2">
            <EC_Input class="w-48 h-5 rounded" v-model="adminStore.userEmailFilter" />
            userEmailFilter
        </div>
        <div class="flex items-center gap-2">
            <EC_Input class="w-48 h-5 rounded" v-model="adminStore.userExamPasswordFilter" />
            userExamPasswordFilter
        </div>
        <div class="flex items-center gap-2">
            <EC_Input class="w-48 h-5 rounded" v-model="adminStore.userExamTitleFilter" />
            userExamTitleFilter
        </div>
        <div class="flex items-center gap-2">
            <VueDatePicker :dark="globalStore.isDarkMode" v-model="adminStore.userStartDateFilter" class="w-48 h-5 rounded mb-5"/>
            userStartDateFilter
        </div>
        <div class="flex items-center gap-2">
            <VueDatePicker :dark="globalStore.isDarkMode" v-model="adminStore.userEndDateFilter" class="w-48 h-5 rounded mb-4"/>
            userEndDateFilter
        </div>
        <div class="flex items-center gap-2">
            <EC_CheckBox v-model="adminStore.expandAllUsers" label="expandAllUsers"/>
        </div>
        <div class="bg-neutral-500 h-0.5 w-full my-1 rounded-full"></div>
        <!--EXAMS-->
        EXAMS:
        <div class="flex items-center gap-2">
            <EC_Input class="w-48 h-5 rounded" v-model="adminStore.examTitleFilter" />
            examTitleFilter
        </div>
        <div class="flex items-center gap-2">
            <EC_Input class="w-48 h-5 rounded" v-model="adminStore.examPasswordFilter" />
            examPasswordFilter
        </div>
        <div class="flex gap-2">
            <EC_Dropdown v-model="adminStore.examAccessFilter" class="w-48"
                :list="[true, false, 'sve']"/>
                examAccessFilter
        </div>
        <div class="flex gap-2">
            <EC_Dropdown v-model="adminStore.examClassFilter" class="w-48"
                :list="['PJS', 'PI', 'sve']"/>
                examClassFilter
        </div>
        <div class="flex items-center gap-2">
            <EC_Input class="w-48 h-5 rounded" v-model="adminStore.examIDFilter" />
            examIDFilter
        </div>
        <div class="flex items-center gap-2">
            <EC_NumberInput class="w-48 h-5 rounded" v-model="adminStore.passwordLength" />
            passwordLength
        </div>
        <div class="bg-neutral-500 h-0.5 w-full my-1 rounded-full"></div>
        <!--SOLUTIONS-->
        SOLUTIONS:
        <div class="flex items-center gap-2">
            <EC_Input class="w-48 h-5 rounded" v-model="adminStore.userSolutionsEmailFilter" />
            userSolutionsEmailFilter
        </div>
        <div class="flex items-center gap-2">
            <EC_CheckBox v-model="adminStore.userSolutionsMatchAccess" label="userSolutionsMatchAccess"/>
        </div>
        <div class="flex items-center gap-2">
            <EC_Input class="w-48 h-5 rounded" v-model="adminStore.selectedSolutionUrl" />
            selectedSolutionUrl
        </div>
        <div class="flex items-center gap-2">
            <EC_NumberInput class="w-48 h-5 rounded" v-model="adminStore.selectedTaskSolution" />
            selectedTaskSolution
        </div>
        <div class="flex items-center gap-2" v-if="adminStore.selectedExam.id != '' && adminStore.examPasswords[adminStore.selectedExam.id]">
            <EC_Dropdown v-model="adminStore.selectedSolutionPassword" class="w-48"
                :list="Object.keys(adminStore.examPasswords[adminStore.selectedExam.id])"/>
            selectedSolutionPassword
        </div>
        <div class="bg-neutral-500 h-0.5 w-full my-1 rounded-full"></div>

        <EC_Button class="w-48" bg="blue" @click="adminStore.fetchCreatedExams()"> fetchCreatedExams </EC_Button>
        <EC_Button class="w-48" bg="blue" @click="adminStore.fetchUsers()"> fetchUsers </EC_Button>
        <EC_Button class="w-48" bg="blue" @click="adminStore.fetchSolutions()"> fetchSolutions </EC_Button>

    </div>
</template> 
<script>
export default {
    data() {
        return {
        }
    }
}
</script>