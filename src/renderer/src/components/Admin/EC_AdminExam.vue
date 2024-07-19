<script setup>
import { adminStore, globalStore } from "@/main.js";

adminStore.checkExamUpToDate();
</script>
<template>
    <div v-if="adminStore.selectedExam.id != ''" class="wh-full flex flex-col dark:bg-neutral-950 bg-neutral-200 drop-shadow-sm dark:bg-opacity-25 rounded">          
        <div class="flex-center p-4 relative">
            
            <div v-if="adminStore.selectedExam.id != ''" class="absolute left-4 flex gap-2">
                <div class="relative cursor-pointer h-6 aspect-square rounded-full flex-center text-neutral-950 transition-150 text-sm pr-[0.5px]"  
                    :class="adminStore.updating ? 'bg-neutral-500 cursor-not-allowed' : 'bg-green-500 hover:bg-green-300 cursor-pointer'">    
                    <i class="fa-solid fa-arrows-rotate transition-150 relative" :class="adminStore.updating ? 'animate-spin' : ''"
                        @click="adminStore.updating ? '' : adminStore.selectExam(adminStore.selectedExam.id);"
                        @mouseover="globalStore.setTooltip('Dohvati najnoviju verziju ispita', 'top', 'text-center')"
                        @mouseleave="globalStore.setTooltip()"> 
                    </i>
                    <span v-if="!adminStore.selectedExamUpToDate" class="animate-ping drop-shadow absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 pointer-events-none"></span>
                </div>
                <div class="relative h-6 aspect-square rounded-full flex-center text-neutral-950 transition-150 text-sm pr-[0.5px]"
                    :class="adminStore.updating ? 'bg-neutral-500 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-300 cursor-pointer'">    
                    <i class="fa-solid fa-broom transition-150" @click="adminStore.updating ? '' : globalStore.setTooltip(); adminStore.deselectExam()"
                        @mouseover="globalStore.setTooltip('Odznači ispit', 'top', 'text-center')"
                        @mouseleave="globalStore.setTooltip()"> 
                    </i>
                </div>
            </div>

            <EC_Title>
                <EC_Button :bg="adminStore.editing ? 'blue' : ''" class="py-1.5 px-4" @click="adminStore.setEditing(true);">Uređivanje ispita</EC_Button>         
                /
                <EC_Button :bg="!adminStore.editing ? 'blue' : ''" class="py-1.5 px-4" @click="adminStore.setEditing(false);">Predana rješenja</EC_Button>
            </EC_Title>

        </div>
        <div class="w-full px-4">
            <div class="bg-neutral-500 w-full h-1 rounded"></div>
        </div>
        <EC_EditExam v-if="adminStore.editing"/>
        <EC_ExamSolutions v-else/>
    </div>
</template>