<script setup>
import { globalStore } from "@/main.js";
globalStore.popups = [];

let rememberTooltip = "";
function checkForRemainingTooltips() {
    if (JSON.stringify(rememberTooltip)==JSON.stringify(globalStore.popups[globalStore.popups.length-1])) 
        globalStore.popups.pop();
    if (globalStore.popups.length > 0) rememberTooltip = globalStore.popups[globalStore.popups.length-1];
}
setInterval(checkForRemainingTooltips, 5000);
</script>
<template>
    <div class="fixed bottom-4 left-4 z-[1000] flex flex-col gap-2 pointer-events-none">
        <TransitionGroup>
            <div v-for="popup in globalStore.popups" :key="popup">
                <div v-if="popup.type=='error'" class="drop-shadow-md px-4 py-1 text-sm font-bold rounded-md flex items-center gap-2
                    text-rose-600 bg-rose-950 bg-opacity-90 border backdrop-blur border-red-500">
                    <i class="fa-solid fa-bug"></i>
                    <div :innerHTML="popup.message"></div>
                </div>
                <div v-if="popup.type=='success'" class="drop-shadow-md px-4 py-1 text-sm font-bold rounded-md flex items-center gap-2
                    text-emerald-600 bg-emerald-950 bg-opacity-90 backdrop-blur border border-emerald-500">
                    <i class="fa-solid fa-square-check"></i>
                    <div :innerHTML="popup.message"></div>
                </div>
                <div v-if="popup.type=='warning'" class="drop-shadow-md px-4 py-1 text-sm font-bold rounded-md flex items-center gap-2
                    text-amber-600 bg-amber-950 bg-opacity-90 backdrop-blur border border-amber-500">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                    <div :innerHTML="popup.message"></div>
                </div>
            </div>
        </TransitionGroup>
    </div>
</template>

<style scoped>
.v-enter-from {
    opacity: 0;
    transform: translateY(50%);
}
.v-leave-to {
    opacity: 0;
    transform: translateY(-50%);
}
.v-enter-to, .v-leave-from {
    opacity: 1;
    transform: translateY(0%);
}
.v-enter-active,
.v-leave-active {
    transition: transform 0.5s ease-out, opacity 0.5s ease-out, translateY 0.5s ease-out;
}
</style>