<script setup>
import { globalStore } from "@/main.js";
</script>
<template>
    <div class="h-full flex flex-col dark:bg-neutral-950 bg-neutral-200 drop-shadow-sm dark:bg-opacity-25 rounded z-10 relative transition-300"
        :class="open ? 'min-w-72 max-w-72' : 'min-w-4 max-w-12'">
        <div class="fixed bl-0 py-2 pl-3 pr-2 rounded-t-md z-50">
			<i @click="open = !open; globalStore.setTooltip(`${open?'Sakrij panel':'Prikaži panel'}`, 'top', 'text-center');"
                class="fa-solid fa-square-caret-up z-50 text-gray-500 dark:text-neutral-400 hover:text-neutral-400 dark:hover:text-sky-500 cursor-pointer -rotate-90 text-3xl" 
                :class="open ? 'scale-100' : '-scale-100'"
                @mouseover="globalStore.setTooltip(`${open?'Sakrij panel':'Prikaži panel'}`, 'top', 'text-center')"
                @mouseleave="globalStore.setTooltip()"></i>
		</div>
        <div class="h-full flex flex-col transition-150" :class="open ? 'opacity-100' : 'opacity-0 pointer-events-none overflow-hidden'">
            <slot></slot>
        </div>
    </div>      
</template>
<script>
export default {
    data() {
        return {
            open: true
        }
    },
}
</script>