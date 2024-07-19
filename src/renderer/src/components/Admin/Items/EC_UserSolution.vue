<script setup>
import { adminStore, globalStore } from "@/main.js";
</script>
<template>
    <div v-if="user.name != 'placeholder.txt'" class="flex w-full gap-1 pr-1">    
        <div class="rounded px-4 py-1 grow truncate text-neutral-600 dark:text-neutral-400"
            :class="adminStore.selectedSolutionUrl == user.url ? 'dark:bg-sky-700 bg-sky-300' : 
            'dark:bg-neutral-950 bg-neutral-400 odd:bg-opacity-25 even:bg-opacity-50 |  odd:dark:bg-opacity-50 even:dark:bg-opacity-80'">
            
            <div class="font-bold cursor-pointer hover:underline truncate" @click="adminStore.setSelectedSolution(user.name, user.url)">{{ user.name.slice(0,-5) }}</div>
        </div>
        <EC_Button :bg="adminStore.updating ? '' : 'blue'" :disabled="adminStore.updating" 
            @click="adminStore.startExamination(user.name, user.url); globalStore.setTooltip();"
            @mouseover="globalStore.setTooltip(`Otvori <b>${user.name.slice(0,-5)}</b><br>u ocjenjivačkom prozoru`, 'top', 'text-center')"
            @mouseleave="globalStore.setTooltip()"
            class="h-8 aspect-square flex-center"> <i class="fa-solid fa-file-export text-sm"></i>
        </EC_Button>
    </div>
</template>
<script>
export default { 
    props: { user: Object },
}
</script>