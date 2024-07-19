<script setup>
import { fileStore, adminStore } from "@/main.js";
</script>

<template>
	<div class="flex flex-col items-center gap-2 z-[70] h-full top-0 pt-4 transition-300 dark:bg-neutral-950 bg-neutral-200 dark:text-neutral-300 text-neutral-800" :class="open ? 'w-28 p-1' : 'w-0 p-0 overflow-hidden'">
        Solutions:
		<div v-for="solution, i in adminStore.batchSolutions" class="relative w-full rounded px-1 transition-150"
            :class="adminStore.selectedSolution.examData.form.JMBAG == solution.examData.form.JMBAG ? 
                'dark:bg-sky-900 bg-sky-400 text-sky-950 dark:text-sky-200 cursor-not-allowed' :
                'dark:bg-neutral-900 bg-neutral-400 cursor-pointer hover:scale-95 hover:brightness-110'" 
                @click="adminStore.selectBatchSolution(solution, i)">
                {{ solution.examData.form.JMBAG }}
		</div>

		<div class="fixed bl-0 py-2 pl-14 pr-2 rounded-t-md">
			<i @click="open = !open" class="fa-solid fa-square-caret-up z-50 text-gray-500 dark:text-neutral-400 hover:text-neutral-400 dark:hover:text-sky-500 cursor-pointer -rotate-90 text-3xl" :class="open ? 'scale-100' : '-scale-100'"></i>
		</div>
	</div>
</template>
<script>
export default {
	data() {
		return { open: true };
	},
	async mounted() {
		await fileStore.loadScriptsVisibility();
		fileStore.loadScript(fileStore.scripts[0].file);
	},
};
</script>
