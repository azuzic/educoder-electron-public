<script setup>
import { adminStore } from "@/main.js";
</script>
<template>
    <div class="rounded px-4 py-1 w-full text-neutral-600 dark:text-neutral-400 relative"
        :class="adminStore.selectedExam.id == exam.id ? 'dark:bg-sky-700 bg-sky-300' : 
        'dark:bg-neutral-950 bg-neutral-400 odd:bg-opacity-25 even:bg-opacity-50 |  odd:dark:bg-opacity-50 even:dark:bg-opacity-80'">
        
        <span v-if="!adminStore.selectedExamUpToDate && adminStore.selectedExam.id == exam.id" class="absolute -top-1 -right-1 flex h-3 w-3">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>

        <div class="font-bold cursor-pointer hover:underline" @click="adminStore.selectExam(exam.id)"> 
            {{ exam.title }}
        </div> 
        
    </div>
</template>
<script>
export default { 
    props: { exam: Object, i: Number },
}
</script>