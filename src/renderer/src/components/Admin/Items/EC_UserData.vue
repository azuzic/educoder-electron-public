<script setup>
import { adminStore } from "@/main.js";
</script>
<template>
    <div class="rounded px-4 py-1 w-full text-neutral-600 dark:text-neutral-400
        bg-neutral-400 odd:bg-opacity-25 even:bg-opacity-50 | dark:bg-neutral-950 odd:dark:bg-opacity-50 even:dark:bg-opacity-80">
        
        <div class="font-bold cursor-pointer hover:underline truncate" @click="collapse = !collapse">{{ user.email }}</div>
        
        <div class="transition-300 flex first:rounded-t-full last:rounded-b px-1 w-full -mt-[1px] z-50
            bg-neutral-400 odd:bg-opacity-25 even:bg-opacity-50 | dark:bg-neutral-950 odd:dark:bg-opacity-25 even:dark:bg-opacity-50"
            :style="collapse && !adminStore.expandAllUsers ? 'height: 0px; overflow: hidden;' : 'height: 87px;'">
            
            <div class="text-2xl">
                <div class="-mt-[3px]">╠</div>
                <div class="-mt-[3px]">╠</div>
                <div class="-mt-[3px]">║</div>
            </div>
            <div class="flex flex-col wh-full justify-evenly z-50 ml-1">
                <div class="flex gap-2 z-50 w-full">
                    <div class="whitespace-nowrap text-sm">Vrsta korisnika:</div>
                    <EC_Dropdown v-model="user.userType" class="grow"
                        :list="['online', 'redovan', 'ostalo']"/>
                </div>
                <div class="flex gap-2 w-full">
                    <div class="whitespace-nowrap text-sm">Kolegij:</div>
                    <EC_Dropdown v-model="user.class" class="w-full"
                        :list="['PJS', 'PI', 'ostalo']"/>
                </div>
                <EC_Button @click="adminStore.updateUser(user)"
                    :disabled="adminStore.updating"
                    :bg="adminStore.updating ? '' : 'blue'"
                    class="rounded aspect-square flex-center h-5 gap-2 w-full">
                    <i class="fa-solid fa-angles-up"></i> Ažuriraj vrstu i kolegij
                </EC_Button>
            </div>
        </div>
        <div v-if="!collapse || adminStore.expandAllUsers" class="bg-neutral-700 dark:bg-neutral-400 h-0.5 rounded-full w-full"></div>
        <div v-for="exam, i in filteredExams" v-if="filteredExams.length > 0"
            class="overflow-hidden transition-300 flex first:rounded-t-full last:rounded-b px-1 w-full
            bg-neutral-50 odd:bg-opacity-25 even:bg-opacity-50 | dark:bg-neutral-700 odd:dark:bg-opacity-20 even:dark:bg-opacity-80"
            :style="collapse && !adminStore.expandAllUsers ? 'height: 0px; ' : 'height: 26px;'"
            :class="[collapse && !adminStore.expandAllUsers ? '' : 'last:mb-2', i==0 ? 'first: rounded-t' : 'mt-[0px]']">
            <div class="text-2xl">
                <div class="-mt-[4px]" v-if="i==filteredExams.length-1">╚</div> 
                <div v-else class="-mt-[5px]" >╠</div>
            </div>
            <div class="flex items-center wh-full -mb-[3px]">
                <div class="w-fit h-fit">
                    <EC_CheckBox class="transition-300" :class="adminStore.updating ? 'pointer-events-none opacity-25' : ''"
                        v-model="exam.initiated" @mouseup="adminStore.updateUserExam(user, exam)"/> 
                </div>
                <div class="grow h-5">
                    <input :value="`${adminStore.createdExams.filter(e => e.id == exam.id)[0]?.title} | ${exam.password}`" disabled
                        class="block rounded border-0 bg-gray-50 dark:bg-neutral-800 text-gray-900 wh-full px-1 text-xs
                            dark:text-neutral-400 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-neutral-700 outline-none
                            placeholder:text-gray-400 dark:placeholder:text-neutral-500" />
                </div>
                <EC_Button :bg="adminStore.updating ? '' : 'red'" @click="adminStore.deleteUserStartedExam(exam, user)" :disabled="adminStore.updating"
                    class="h-5 !py-0.5 !px-1 ml-1"><i class="fa-solid fa-trash-can"></i></EC_Button>
                <EC_Button :bg="adminStore.updating || selectedSolution(exam.id, exam.password, user) ? '' : 'blue'" 
                    @click="adminStore.selectUserSolution(exam.id, exam.password, user)" 
                    :disabled="adminStore.updating || selectedSolution(exam.id, exam.password, user)"
                    class="h-5 !py-0.5 !px-1 ml-1"><i class="fa-solid fa-file-export"></i></EC_Button>
            </div>
        </div>
        <div v-else class="overflow-hidden transition-300 flex last:rounded-b px-1 w-full
            bg-neutral-400 odd:bg-opacity-25 even:bg-opacity-50 | dark:bg-red-900 odd:dark:bg-opacity-25 even:dark:bg-opacity-50"
            :style="collapse && !adminStore.expandAllUsers ? 'height: 0px;' : 'height: 24px;'">
            <div class="text-2xl -mt-1" >
                <div>╚</div>
            </div>
            <div>| Nema rezultata ... </div>
        </div>
    </div>
</template>
<script>
export default { 
    props: { user: Object, i: Number },
    data() { return { collapse: true } },
    computed: {
        filteredExams() {
            let time = date => Math.floor(new Date(date).getTime())
            let start = adminStore.userStartDateFilter == null ? true : time(adminStore.userStartDateFilter);
            let end = adminStore.userEndDateFilter == null ? true : time(adminStore.userEndDateFilter);

            return this.user.acessedExams.filter(e =>
                (this.filterExamTitle(e) &&  
                this.filterExamPassword(e) &&
                this.filterStartDate(e, start) && 
                this.filterEndDate(e, end))
            );
        },
    },
    methods: {
        selectedSolution(id, password, user) {
            return adminStore.selectedUserSolution.id == id && adminStore.selectedUserSolution.password == password && adminStore.selectedUserSolution.userEmail == user.email
        },
        filterExamTitle(exam) {
            const filteredExam = adminStore.createdExams.filter(c => c.id == exam.id)[0];
            return filteredExam ? filteredExam.title.toLowerCase().includes(adminStore.userExamTitleFilter.toLowerCase()) : false;
        },

        filterExamPassword(exam) {
            return exam.password.toLowerCase().includes(adminStore.userExamPasswordFilter.toLowerCase()) || adminStore.userExamPasswordFilter == '';
        },

        filterStartDate(exam, start) {
            return (exam.accessed > start && (exam.accessed !== undefined)) || start == true;
        },
        filterEndDate(exam, end) {
            return (exam.accessed < end && (exam.accessed !== undefined)) || end == true;
        }
    }
}
</script>