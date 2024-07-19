<script setup>
import logo from "@/assets/images/logo.svg";
import { globalStore } from "@/main.js";
</script>
<template>
	<div class="relative w-full dark:bg-neutral-900 bg-sky-500 text-neutral-100 dark:text-sky-500 z-[100] transition-all duration-300" 
        :class="open ? 'min-h-16 h-16' : 'min-h-0 h-0'">
		<div class="overflow-hidden flex px-16 wh-full">
			<router-link to="/home" class="font-semibold text-2xl tracking-wider h-full flex-center gap-4 group">

				<div class="flex-center h-full relative">
                    <div class="p-1 relative">
                        <img :src="logo" class="h-14 transition-150 p-1 bg-white dark:bg-transparent rounded-full group-hover:scale-95 cursor-pointer" />
                    </div>
					<span class="group-hover:tracking-widest transition-150">
                        EduCoder                       
					    <span class="text-xs">v{{ globalStore.EduCoderVersion }}</span>
                    </span>
				</div>
			</router-link>

			<div class="grow flex justify-end items-center gap-4">
				<EC_Auth />
			</div>
		</div>

		<div v-if="['Exam', 'Batch Examination'].includes($route.name)" class="absolute tl-0 py-2 pl-3 pr-2 rounded-t-md">
			<i @click="open = !open; globalStore.setTooltip(`${open?'Sakrij zaglavlje':'Prikaži zaglavlje'}`, 'bottom', 'text-center', [0, 16]);" 
                class="fa-solid fa-square-caret-up z-50 text-gray-500 dark:text-neutral-400 hover:text-neutral-400 dark:hover:text-sky-500 cursor-pointer text-3xl drop-shadow" 
                :class="open ? 'scale-100' : '-scale-100'"
                @mouseover="globalStore.setTooltip(`${open?'Sakrij zaglavlje':'Prikaži zaglavlje'}`, 'bottom', 'text-center', [0, 16])"
                @mouseleave="globalStore.setTooltip()"></i>
		</div>
	</div>
</template>
<script>
export default {
	data() {
		return { open: true };
	},
};
</script>
