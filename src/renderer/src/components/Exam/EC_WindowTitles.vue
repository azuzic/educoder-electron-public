<script setup>
import { globalStore, examStore, fileStore } from "@/main.js"
</script>
<template>
    <div class="wh-full">

        <div class="grow flex-center" v-if="type == 'HTML'">HTML / CSS</div>

        <div class="grow flex-center" v-if="type == 'JS'">
            <div class="flex gap-2 w-full justify-center items-center">
                <i class="fa-solid fa-circle-question"
                    @mouseover="globalStore.setTooltip('DO, WHILE i FOR <br> moraju imati vitičaste zagrade { }', 'top', 'text-center')"
                    @mouseleave="globalStore.setTooltip()">
                </i>
                {{ getTitleType() }}
                <div v-if="examStore.codeAlert == 'loop'" class="text-orange-600 font-bold">
                    Vrijeme izvršenja koda je premašeno!
                    <i class="fa-solid fa-arrows-spin"></i>
                </div>
                <div v-else-if="examStore.codeAlert == 'good'" class="text-green-600 font-bold">
                    OK!
                    <i class="fa-regular fa-square-check"></i>
                </div>
                <div v-else-if="examStore.codeAlert == 'error'" class="text-rose-600 font-bold">
                    Greške u kodu!
                    <i class="fa-solid fa-bug"></i>
                </div>
                <div v-else-if="examStore.codeAlert != 'OK'" class="text-yellow-600 font-bold">
                    <span class="text-rose-600">{{examStore.codeAlert }}</span> nema vitičaste zagrade!
                    <i class="fa-solid fa-warning"></i>
                </div>
            </div>
        </div>

        <div class="grow flex-center" v-if="type == 'PREVIEW'">Pregled</div>

        <div class="grow flex-center" v-if="type == 'MARKDOWN'">
            <EC_Button v-if="examStore.examSet" class="pb-0 font-bold" @click="examStore.selectTask(examStore.currentSolution)"
                :disabled="examStore.markdownTab == 'task'" :bg="examStore.markdownTab == 'task' ? 'blue' : ''">Zadatak</EC_Button>
            <span v-if="examStore.examSet" class="px-1">/</span>
            <EC_Button v-if="examStore.examSet" class="pb-0 font-bold my-[3px]" @click="fileStore.loadScript(fileStore.selectedScript)"
                :disabled="examStore.markdownTab == 'script'" :bg="examStore.markdownTab == 'script' ? 'blue' : ''">Skripta</EC_Button>
            <span v-else="examStore.examSet" class="px-1">Skripta</span>
        </div>

        <div class="grow flex-center gap-2" v-if="type == 'LOG'">
            <div class="cursor-pointer h-4 w-6 rounded-full flex-center text-neutral-950 transition-150 relative text-xs"
                :class="globalStore.groupLogMessaged ? 'bg-green-600 hover:bg-green-500' : 'bg-sky-500 hover:bg-sky-400'">
                <i class="fa-solid fa-link transition-150 absolute" @click="globalStore.groupLogMessaged = !globalStore.groupLogMessaged; globalStore.setTooltip('Grupiraj iste podatke', 'top', 'text-center');"
                    :class="globalStore.groupLogMessaged ? 'opacity-100 scale-100' : 'opacity-0 scale-0'"
                    @mouseover="globalStore.setTooltip('Odgrupiraj iste podatke', 'top', 'text-center')"
                    @mouseleave="globalStore.setTooltip()"></i>
                <i class="fa-solid fa-link-slash transition-150 absolute" @click="globalStore.groupLogMessaged = !globalStore.groupLogMessaged; globalStore.setTooltip('Odgrupiraj iste podatke', 'top', 'text-center');"
                    :class="!globalStore.groupLogMessaged ? 'opacity-100 scale-100' : 'opacity-0 scale-0'"
                    @mouseover="globalStore.setTooltip('Grupiraj iste podatke', 'top', 'text-center')"
                    @mouseleave="globalStore.setTooltip()"></i>
            </div>
            <div class="cursor-pointer h-4 w-6 rounded-full flex-center text-neutral-950 transition-150 relative text-xs"
                :class="globalStore.showConsoleVariableType ? 'bg-green-600 hover:bg-green-500' : 'bg-sky-500 hover:bg-sky-400'">
                <i class="fa-solid fa-comment transition-150 absolute" @click="globalStore.showConsoleVariableType = !globalStore.showConsoleVariableType; globalStore.setTooltip('Prikaži tip podatka', 'top', 'text-center');"
                    :class="globalStore.showConsoleVariableType ? 'opacity-100 scale-100' : 'opacity-0 scale-0'"
                    @mouseover="globalStore.setTooltip('Sakrij tip podatka', 'top', 'text-center')"
                    @mouseleave="globalStore.setTooltip()"></i>
                <i class="fa-solid fa-comment-slash transition-150 absolute" @click="globalStore.showConsoleVariableType = !globalStore.showConsoleVariableType; globalStore.setTooltip('Sakrij tip podatka', 'top', 'text-center');"
                    :class="!globalStore.showConsoleVariableType ? 'opacity-100 scale-100' : 'opacity-0 scale-0'"
                    @mouseover="globalStore.setTooltip('Prikaži tip podatka', 'top', 'text-center')"
                    @mouseleave="globalStore.setTooltip()"></i>
            </div>
            Konzola
            <div class="cursor-pointer h-4 w-6 rounded-full flex-center text-neutral-950 transition-150 relative text-xs"
                :class="globalStore.consoleJSON ? 'bg-green-600 hover:bg-green-500' : 'bg-sky-500 hover:bg-sky-300'">
                <i class="fa-solid fa-code transition-150 absolute" @click="globalStore.consoleJSON = !globalStore.consoleJSON; globalStore.setTooltip('Običan ispis', 'top', 'text-center');"
                    :class="globalStore.consoleJSON ? 'opacity-100 scale-100' : 'opacity-0 scale-0'"
                    @mouseover="globalStore.setTooltip('Formatirani ispis', 'top', 'text-center')"
                    @mouseleave="globalStore.setTooltip()"></i>
                <i class="fa-solid fa-font transition-150 absolute" @click="globalStore.consoleJSON = !globalStore.consoleJSON; globalStore.setTooltip('Formatirani ispis', 'top', 'text-center');"
                    :class="!globalStore.consoleJSON ? 'opacity-100 scale-100' : 'opacity-0 scale-0'"
                    @mouseover="globalStore.setTooltip('Običan ispis', 'top', 'text-center')"
                    @mouseleave="globalStore.setTooltip()"></i>
            </div>
            <div class="cursor-pointer h-4 w-4 rounded-full flex-center text-neutral-950 transition-150 relative text-[11px] pr-[0.5px]"
                :class="[globalStore.consoleJSON ? 'opacity-100 scale-100' : 'opacity-0 scale-0',
                    globalStore.consoleJSONdepth!=-1 ? 'bg-green-600 hover:bg-green-500' : 'bg-sky-500 hover:bg-sky-300']">
                <i class="fa-solid fa-compress transition-150" @click="globalStore.consoleJSONdepth=-1;
                    globalStore.setTooltip('Smanji polja i objekte', 'top', 'text-center');"
                    :class="globalStore.consoleJSONdepth!=-1 ? 'opacity-100 scale-100' : 'opacity-0 scale-0'"
                    @mouseover="globalStore.setTooltip('Proširi polja i objekte', 'top', 'text-center')"
                    @mouseleave="globalStore.setTooltip()">
                </i>
                <i class="fa-solid fa-expand transition-150 absolute" @click="globalStore.consoleJSONdepth=10;
                    globalStore.setTooltip('Proširi polja i objekte', 'top', 'text-center');"
                    :class="globalStore.consoleJSONdepth==-1 ? 'opacity-100 scale-100' : 'opacity-0 scale-0'"
                    @mouseover="globalStore.setTooltip('Smanji polja i objekte', 'top', 'text-center')"
                    @mouseleave="globalStore.setTooltip()">
                </i>
            </div>
        </div>

    </div>
</template>
<script>
import { globalStore } from "@/main.js"
import "@/scripts/ace-config";

export default {
    name: "WindowTitles",
    props: {
        type: String,
    },
    methods: {
        getTitleType() {
            const lang = {
                "c_cpp": "C++",
                "javascript": "JavaScript",
                "python": "Python",
            }
            return lang[examStore.options.evaluator];
        },
    }
}
</script>
