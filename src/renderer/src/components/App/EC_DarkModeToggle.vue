<script setup>
import { globalStore } from "@/main.js";
</script>
<template>
    <button id="themeToggle" @click="globalStore.toggleTheme"
        class="h-8 w-8 flex-center overflow-hidden rounded-full fixed top-4 right-4 z-[2000] hover:brightness-125"
        :class="globalStore.isDarkMode ? 'bg-gray-200 text-neutral-800' : 'bg-gray-800 text-neutral-200'"
        @mouseover="globalStore.setTooltip(`${globalStore.isDarkMode?'Svijetla tema':'Tamna tema'}`, 'bottom', 'text-center', [0, 16])"
        @mouseleave="globalStore.setTooltip()">
        <i class="fa-solid fa-sun absolute transition-300" :class="globalStore.isDarkMode ? 'left-12' : 'left-2'"></i>
        <i class="fa-solid fa-moon absolute transition-300" :class="!globalStore.isDarkMode ? 'right-12' : 'right-2.5'"></i>
    </button>
</template>