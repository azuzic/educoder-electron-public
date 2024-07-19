<script setup>
import { globalStore } from "@/main.js";
</script>

<template>
    <div class="fixed flex justify-center items-center top-0 left-0 w-full h-full">
        <div class="fixed top-0 left-0 w-full h-full bg-neutral-950 bg-opacity-50 backdrop-blur-sm"></div>

        <div class="relative flex-center wh-full">                
            <div class="absolute max-h-[92%] overflow-hidden rounded-2xl p-6 shadow-xl transition-all text-sm text-justify overflow-y-auto"
                :class="globalStore.isDarkMode ? 'bg-neutral-950 text-neutral-400' : 'bg-white text-gray-600'">
                <slot></slot>
            </div>
        </div>
    </div>
</template>