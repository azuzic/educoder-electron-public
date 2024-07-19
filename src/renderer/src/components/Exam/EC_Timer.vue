<template>
	<div class="fixed left-1/2 -translate-x-1/2 top-4 z-[500] pointer-events-none -translate-y-1/2 flex-center rounded-b-md h-9 px-2 bg-sky-600 text-neutral-100 dark:text-neutral-800 dark:bg-neutral-300 text-2xl font-mono drop-shadow-md">
		<span v-if="examStore.remainingTime != 'Bez ograničenja' && examStore.remainingTime > 0">{{ formattedTime }}</span>
		<span v-else> Bez ograničenja </span>
	</div>
</template>

<script setup> 
import { examStore } from "@/main.js";
</script>

<script>
export default {
    mounted() {
        if (examStore.examInProgress) examStore.setupTimer();
    },
    computed: {
        formattedTime() {
            const minutes = Math.floor(examStore.remainingTime / 60);
            const seconds = examStore.remainingTime % 60;
            return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        }
    }
}
</script>