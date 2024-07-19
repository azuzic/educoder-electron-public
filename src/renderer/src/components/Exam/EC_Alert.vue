<script setup>
import { globalStore } from "@/main.js"
</script>

<template>
    <!-- ALERT -->
    <div id="customAlertPopup" class="fixed wh-full z-[5000] bg-slate-950 bg-opacity-25 hidden">

        <div class=" border border-slate-600 px-4 py-4 w-fit h-fit min-w-64 rounded pointer-events-auto absolute drop-shadow-lg
            translate-center flex flex-col justify-start items-end gap-4" 
            :class="globalStore.isDarkMode ? 'bg-slate-900' :  'bg-slate-200'">
            <p class="mt-1 text-sm leading-6 w-full text-left" id="customAlertMessage"
                :class="globalStore.isDarkMode ? 'text-slate-400' :  'text-slate-700'"></p>
            <EC_Button id="customAlertClose" bg="blue" class="px-8 py-1"> OK </EC_Button>
        </div>

    </div>

    <!-- PROMPT -->
    <div id="customPrompt" class="fixed wh-full z-[5000] bg-slate-950 bg-opacity-25 hidden">

       <div class="border border-slate-600 px-4 py-4 w-fit h-fit min-w-64 rounded pointer-events-auto absolute drop-shadow-lg
            translate-center flex flex-col justify-start items-end gap-4"
            :class="globalStore.isDarkMode ? 'bg-slate-900' :  'bg-slate-200'">
            <p class="mt-1 text-sm leading-6 w-full text-left" id="promptMessage"
                :class="globalStore.isDarkMode ? 'text-slate-400' :  'text-slate-700'">test</p>
            <input id="promptInput" type="text"  placeholder="Enter value..."
                class="block rounded-md border-0 w-full py-1.5 pl-3 shadow-sm ring-1 ring-inset outline-none focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6" 
                :class="globalStore.isDarkMode ? 'placeholder:text-slate-500 ring-slate-700 bg-slate-800 text-slate-400' : 
                    'placeholder:text-slate-400 ring-slate-300 bg-slate-50 text-slate-900'"/>
            <div class="flex justify-between w-full">
                <EC_Button id="promptCancel" bg="red" class="w-16 py-1"> Cancel </EC_Button>
                <EC_Button id="promptConfirm" bg="green" class="w-16 py-1"> OK </EC_Button>
            </div>
        </div>

    </div>

</template>
