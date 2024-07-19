<script setup>
import { fileStore, globalStore } from "@/main.js";
import { logojs } from "@/scripts/images.js";
</script>

<template>
	<div class="flex flex-col items-center gap-2 z-[75] h-full overflow-y-auto top-0 pt-2 transition-300 dark:bg-neutral-800/50 bg-neutral-200" :class="open ? 'w-12 min-w-12 p-1' : 'w-0 min-w-0 p-0'">
		<div v-for="(script, i) in fileStore.scripts" class="relative w-full">
			<div v-if="script.visible" class="relative w-full flex items-center gap-2 drop-shadow-md group max-h-10 cursor-pointer">
				<img class="transition-300 relative rounded min-w-10 w-10 h-10 group-hover:scale-100 scale-90"
                    :class="[open ? 'left-0' : '-left-12', fileStore.selectedScript == script.file ? 
                        'scale-105 brightness-110 ring-2 ring-neutral-950 dark:ring-neutral-100 border border-black' : 'group-hover:brightness-100 brightness-50']" 
                    :src="logojs[i]" @click="fileStore.loadScript(script.file)"
                    @mouseover="globalStore.setTooltip(`<div class='w-52 text-sm whitespace-normal text-left'>${script.title}</div>`, 'right', 'text-center', [24, 0])"
                    @mouseleave="globalStore.setTooltip()"/>
			</div>
		</div>

		<div class="absolute bl-0 py-2 pl-3 pr-2 rounded-t-md">
			<i @click="open = !open; globalStore.setTooltip(`${open?'Sakrij listu skripti':'Prikaži listu skripti'}`, 'bottom', 'text-center', [0, 16]);" 
                class="fa-solid fa-square-caret-up z-50 text-neutral-600 dark:text-neutral-400 hover:text-sky-500 dark:hover:text-sky-600 cursor-pointer -rotate-90 text-3xl" 
                :class="open ? 'scale-100' : '-scale-100'"
                @mouseover="globalStore.setTooltip(`${open?'Sakrij listu skripti':'Prikaži listu skripti'}`, 'bottom', 'text-center', [0, 16])"
                @mouseleave="globalStore.setTooltip()"></i>
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
