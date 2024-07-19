<script setup>
import { globalStore } from "@/main.js"; 
import { wait } from "@/scripts/helpers.js";

const lightThemes = ["chrome", "github", "iplastic", "katzenmilch", "kuroir", "solarized_light", "sqlserver", "textmate", "tomorrow", "xcode"];
const darkThemes = ["ambiance", "chaos", "clouds_midnight", "cobalt", "dracula", "gob", "gruvbox", "idle_fingers", "kr_theme", "merbivore", "merbivore_soft", "mono_industrial", "monokai", "pastel_on_dark", "solarized_dark", "terminal", "tomorrow_night", "tomorrow_night_blue", "tomorrow_night_bright", "tomorrow_night_eighties", "twilight", "vibrant_ink"];
</script>

<template>
    <div class="fixed flex-center-full z-[200] transition-300" :class="globalStore.showSettings ? 'bg-neutral-950/25' : 'pointer-events-none'">
        <div class="flex flex-col gap-2 text-sm fixed z-[200000] transition-300
            bg-neutral-100 dark:bg-neutral-950 drop-shadow px-4 py-2 rounded"
            :class="globalStore.showSettings ? 'opacity-100' : 'opacity-0 pointer-events-none'">

            <div class="dark:text-neutral-400 text-neutral-800 flex justify-between items-center">
                Opcije: 
                <i class="fa-solid fa-xmark t-2 l-2 z-50 window-button scale-125 active:scale-100 transition-100" 
                @click="globalStore.showSettings = !globalStore.showSettings"></i>
            </div>

            <div class="h-0.5 bg-neutral-500 rounded-full"></div>

            <div class="flex gap-1">
                <div class="flex flex-col items-end gap-2">
                    <span class="dark:text-neutral-400 text-neutral-800">Izgled: </span>
                    <span class="dark:text-neutral-400 text-neutral-800">HTML tab size: </span>
                    <span class="dark:text-neutral-400 text-neutral-800">JS tab size: </span>
                    <span class="dark:text-neutral-400 text-neutral-800">Sakrij HTML/CSS: </span>
                    <span class="dark:text-neutral-400 text-neutral-800">Sakrij Skriptu: </span>
                    <span class="dark:text-neutral-400 text-neutral-800">Sakrij JavaScript: </span>
                    <span class="dark:text-neutral-400 text-neutral-800">Sakrij Konzolu: </span>
                    <span class="dark:text-neutral-400 text-neutral-800">Sakrij Pregled: </span>
                </div>

                <div class="flex flex-col gap-2">
                    <EC_Dropdown v-if="globalStore.isDarkMode" v-model="globalStore.selectedDarkTheme" class="w-24 z-50" :label="globalStore.selectedDarkTheme" :list="darkThemes" />
                    <EC_Dropdown v-else v-model="globalStore.selectedLightTheme" class="w-24 z-40" :label="globalStore.selectedLightTheme" :list="lightThemes" />
                    <EC_Dropdown v-model="globalStore.HTMLtabSize" class="w-24 z-30" :label="globalStore.HTMLtabSize" :list="['2', '4']" />
                    <EC_Dropdown v-model="globalStore.JStabSize" class="w-24 z-20" :label="globalStore.JStabSize" :list="['2', '4']" />
                    <EC_CheckBox class="h-5" v-model="globalStore.windowsHidden['HTML']"
                        @mouseup="removeSelf(!globalStore.windowsHidden['HTML'], 'HTML', {id: '1',type: 'HTML'})"/>
                    <EC_CheckBox class="h-5" v-model="globalStore.windowsHidden['MARKDOWN']"
                        @mouseup="removeSelf(!globalStore.windowsHidden['MARKDOWN'], 'MARKDOWN', {id: '4',type: 'MARKDOWN'})"/>
                    <EC_CheckBox class="h-5" v-model="globalStore.windowsHidden['JS']"
                        @mouseup="removeSelf(!globalStore.windowsHidden['JS'], 'JS', {id: '2',type: 'JS'})"/>
                    <EC_CheckBox class="h-5" v-model="globalStore.windowsHidden['LOG']"
                        @mouseup="removeSelf(!globalStore.windowsHidden['LOG'], 'LOG', {id: '3',type: 'LOG'})"/>
                    <EC_CheckBox class="h-5" v-model="globalStore.windowsHidden['PREVIEW']"
                        @mouseup="removeSelf(!globalStore.windowsHidden['PREVIEW'], 'PREVIEW', {id: '5',type: 'PREVIEW'})"/>
                </div>
            </div>

        </div>
    </div>
</template>
<script>
export default {
    name: "Window",    
    methods: {
        handlePreviewClick(event) {
            event.stopPropagation();
        },
        async removeSelf(value, type, element) {
            if (!value) {
                this.shiftLeft(element)
                return;
            }
            globalStore.initiateDragging();
            for (let i = 0; i < globalStore.draggable1.length; i++)
                if (globalStore.draggable1[i].type === type) {
                    globalStore.draggable1.splice(i, 1)[0];
                    break;
                }
            for (let i = 0; i < globalStore.draggable2.length; i++)
                if (globalStore.draggable2[i].type === type) {
                    globalStore.draggable2.splice(i, 1)[0];
                    break;
                }
            for (let i = 0; i < globalStore.draggable3.length; i++)
                if (globalStore.draggable3[i].type === type) {
                    globalStore.draggable3.splice(i, 1)[0];
                    break;
                }
            for (let i = 0; i < globalStore.draggable4.length; i++)
                if (globalStore.draggable4[i].type === type) {
                    globalStore.draggable4.splice(i, 1)[0];
                    break;
                }
        },
        async shiftLeft(element) {
            if (["HTML", "JS", "LOG"].includes(element.type))
                globalStore.draggable2.unshift(element);
            else globalStore.draggable3.unshift(element);
            for (let index = 0; index < 3; index++) {  
                let divElements = document.getElementsByClassName("window");
                divElements.forEach((e) => { e.style.height = "50%"; });	
                let divElement = document.getElementById("draggableid2");
                divElement.style.width = "50%";			
                divElements = divElement.getElementsByClassName("window");
                divElements.forEach((e) => { e.style.height = ""+100/3+"%"; });            
                await wait(0.1);
            }
        },
    }
};
</script>