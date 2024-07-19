<script setup>
import { globalStore, examStore } from "@/main.js"  
</script>
<template>
    <div class="relative w-full h-full overflow-auto">
        <iframe @mouseenter="examStore.mouseOnIframe = true" @mouseout="examStore.mouseOnIframe = false" :style="`scale: ${globalStore.PREVIEWSize};`"
            class="absolute top-0 left-0 w-full h-full origin-top-left" :class="globalStore.isDarkMode ? 'bg-[#262626]' : 'bg-white'"></iframe>
    </div>
</template>