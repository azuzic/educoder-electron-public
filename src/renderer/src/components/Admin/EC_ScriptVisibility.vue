<script setup>
import { adminStore, fileStore, globalStore } from "@/main.js";
import { logojs } from "@/scripts/images.js"
</script>
<template>
    <div class="w-full flex flex-col items-center p-4">                     
        <div class="flex px-4 py-2 justify-start items-center wh-full overflow-auto gap-1
            dark:bg-neutral-950 bg-neutral-200 drop-shadow-sm dark:bg-opacity-25 rounded z-10">
            <div class="flex-center gap-2 pr-2 whitespace-nowrap">
                <EC_Button @click="fileStore.loadScriptsVisibility()" :disabled="adminStore.updating" :bg="adminStore.updating ? '' : 'blue'" class="rounded-full aspect-square flex-center"
                    @mouseover="globalStore.setTooltip(`Dohvati skripte`, 'top', 'text-center')"
                    @mouseleave="globalStore.setTooltip()"><i class="fa-solid fa-cloud-arrow-down"></i></EC_Button>
                <EC_Title>Vidljivost skripti:</EC_Title>
            </div>        
            <img v-for="script, i in fileStore.scripts" class="relative transition-300 cursor-pointer 
                rounded min-w-10 w-10 h-10 mx-1 ring-4 ring-blue-500 ring-opacity-0" :class="[script.visible ? 'hue-rotate-30' : '-hue-rotate-60', 
                    adminStore.updating ? 'cursor-not-allowed contrast-75 brightness-75' : 'hover:ring-opacity-100 active:scale-75 contrast-90 brightness-90' ]"
                @click="adminStore.updating ? '' : adminStore.updateScriptVisibility(i)" :src="logojs[i]">
        </div>
    </div>
</template>