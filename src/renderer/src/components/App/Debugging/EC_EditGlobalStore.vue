<script setup>
import { globalStore } from "@/main.js";
const lightThemes = ["chrome", "github", "iplastic", "katzenmilch", "kuroir", "solarized_light", "sqlserver", "textmate", "tomorrow", "xcode"];
const darkThemes = ["ambiance", "chaos", "clouds_midnight", "cobalt", "dracula", "gob", "gruvbox", "idle_fingers", "kr_theme", "merbivore", "merbivore_soft", "mono_industrial", "monokai", "pastel_on_dark", "solarized_dark", "terminal", "tomorrow_night", "tomorrow_night_blue", "tomorrow_night_bright", "tomorrow_night_eighties", "twilight", "vibrant_ink"];
</script>

<template>
    <div v-if="globalStore.storeSelected == 'globalStore'" class="flex flex-col gap-0.5 text-sm"> 
        <div class="flex items-center gap-2">
            <EC_Input class="w-48 h-5 rounded" v-model="globalStore.EduCoderVersion" />
            EduCoderVersion
        </div>
        <EC_CheckBox v-model="globalStore.debugOpen" label="debugOpen" /> 
        <div class="flex gap-2">
            <EC_Dropdown v-model="globalStore.storeSelected" class="w-48"
                :list="['globalStore', 'examStore', 'userStore', 'fileStore']"/>
            storeSelected
        </div>
        <div class="flex items-center gap-2">
            <EC_Input class="w-48 h-5 rounded" type="number" v-model="globalStore.depth" />
            depth
        </div>
        <EC_CheckBox v-model="globalStore.isDragging" label="isDragging" /> 
        <EC_CheckBox v-model="globalStore.refreshDraggable[0]" label="refreshDraggable1" /> 
        <EC_CheckBox v-model="globalStore.refreshDraggable[1]" label="refreshDraggable2" /> 
        <EC_CheckBox v-model="globalStore.refreshDraggable[2]" label="refreshDraggable3" /> 
        <EC_CheckBox v-model="globalStore.refreshDraggable[3]" label="refreshDraggable4" /> 
        <div class="flex gap-2">
		    <EC_Dropdown v-model="globalStore.selectedDarkTheme" class="w-48 z-50" :label="globalStore.selectedDarkTheme" :list="darkThemes" />
            selectedDarkTheme
        </div>
        <div class="flex gap-2">
		    <EC_Dropdown v-model="globalStore.selectedLightTheme" class="w-48 z-40" :label="globalStore.selectedLightTheme" :list="lightThemes" />
            selectedLightTheme
        </div>
        <EC_CheckBox v-model="globalStore.isDarkMode" label="isDarkMode" /> 
        <EC_CheckBox v-model="globalStore.themeChanging" label="themeChanging" /> 
        <div class="flex items-center gap-2">
            <EC_Input class="w-48 h-5 rounded" min="8" max="64" type="number" v-model="globalStore.HTMLfontSize" />
            HTMLfontSize
        </div>
        <div class="flex items-center gap-2">
            <EC_Input class="w-48 h-5 rounded" min="8" max="64"  type="number" v-model="globalStore.JSfontSize" />
            JSfontSize
        </div>
        <div class="flex gap-2">
		    <EC_Dropdown v-model="globalStore.HTMLtabSize" class="w-48 z-30" :list="['2', '4']" />
            HTMLtabSize
        </div>
        <div class="flex gap-2">
		    <EC_Dropdown v-model="globalStore.JStabSize" class="w-48 z-20" :list="['2', '4']" />
            JStabSize
        </div>
        <div class="flex flex-col w-fit gap-0.5 mt-1 bg-black dark:bg-white bg-opacity-10 dark:bg-opacity-10 p-1 rounded">
            <EC_Button class="w-48" bg="red" @click="globalStore.resetLayout()"> resetLayout </EC_Button>
        </div>
        <div class="flex flex-col w-fit gap-0.5 mt-1 bg-black dark:bg-white bg-opacity-10 dark:bg-opacity-10 p-1 rounded">
            <EC_Button class="w-48" bg="green" @click="globalStore.pushPopup(c, t)"> pushPopup </EC_Button>
            <div class="flex items-center gap-2">
                <EC_Dropdown v-model="t" class="w-24 z-30" :list="['success', 'warning', 'error']" />
                type
            </div>
            <div class="flex items-center gap-2">
                <EC_Input class="w-24 h-5 rounded" v-model="c" /> message
            </div>
        </div>
        <div class="flex flex-col w-fit gap-0.5 mt-1 bg-black dark:bg-white bg-opacity-10 dark:bg-opacity-10 p-1 rounded">
            <EC_Button class="w-48" bg="blue" @click="globalStore.toggleTheme()"> toggleTheme </EC_Button>
        </div>
    </div>
</template> 
<script>
export default {
    data() {
        return {
             c: 'test',
             t: 'success',
        }
    }
}
</script>