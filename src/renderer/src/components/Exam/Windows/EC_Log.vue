<script setup>
import { examStore, globalStore } from "@/main.js"
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";
</script>
<template>
    <div class="flex bg-white dark:bg-[#1D1F21] h-full overflow-auto font-mono" :style="`font-size: ${globalStore.LOGfontSize}px !important;`">
        <div class="bg-neutral-100 dark:bg-[#25282C] min-w-10 h-full absolute"></div>
        <div class="flex flex-col grow pl-1">
            <div v-for="log, i in formatedExamLogMessages()">
                <div v-if="log.type == 'log'" class="flex gap-2">
                    <div class="flex flex-col min-w-10 w-fit h-full z-10">
                            <div class="text-right text-black dark:text-gray-400 pr-3 whitespace-nowrap overflow-hidden">{{i+1}}</div>
                    </div>
                    <div class="flex gap-2 dark:opacity-80 w-full" :style="`* {  }`">
                        <div class="text-sky-600 dark:text-sky-400 whitespace-nowrap"><i class="fas fa-info-circle"></i>
                            <span class="text-amber-600 dark:text-amber-400" v-if="globalStore.groupLogMessaged"> [{{log.count}}]</span> {{ getOutputType() }}:
                        </div>
                        <span v-if="globalStore.showConsoleVariableType">({{typeof log.msg == "undefined" ? "undefined" : typeof newValueFormatted(log.msg)}})</span>
                        <vue-json-pretty v-if="globalStore.consoleJSON" :itemHeight="globalStore.LOGfontSize+globalStore.LOGfontSize/2"
                            class="text-gray-500 dark:text-gray-300 w-full" style="font-size: inherit;"
                            :deep="globalStore.consoleJSONdepth" :data="newValueFormatted(log.msg)"/>
                        <div v-else class="text-gray-500 dark:text-gray-300 w-full">
                            {{ log.msg }}
                        </div>
                    </div>
                </div>
                <div v-else class="flex gap-2">
                    <div class="flex flex-col min-w-10 w-fit h-full z-10">
                            <div class="text-right text-black dark:text-gray-400 pr-3 whitespace-nowrap overflow-hidden">{{i+1}}</div>
                    </div>
                    <div class="flex gap-2 dark:opacity-90 w-full">
                        <div class="text-rose-600 dark:text-rose-400 whitespace-nowrap">
                            <template v-if="log.type.includes('SyntaxError')">
                                <i class="fas fa-bug"></i>
                            </template>
                            <template v-else-if="log.type.includes('ReferenceError')">
                                <i class="fas fa-exclamation-triangle"></i>
                            </template>
                            <template v-else-if="log.type.includes('TypeError')">
                                <i class="fas fa-times-circle"></i>
                            </template>
                            <template v-else-if="log.type.includes('RangeError')">
                                <i class="fa-solid fa-arrow-down-1-9"></i>
                            </template>
                            <template v-else-if="log.type.includes('InternalError')">
                                <i class="fas fa-ban"></i>
                            </template>
                            <template v-else-if="log.type.includes('IndentationError')">
                                <i class="fa-solid fa-indent"></i>
                            </template>
                            <template v-else-if="log.type.includes('ValueError')">
                                <i class="fa-solid fa-strikethrough"></i>
                            </template>
                            <template v-else-if="log.type.includes('AttributeError')">
                                <i class="fa-solid fa-list"></i>
                            </template>
                            <template v-else-if="log.type.includes('KeyError')">
                                <i class="fa-solid fa-key"></i>
                            </template>
                            <template v-else-if="log.type.includes('FileNotFoundError')">
                                <i class="fa-solid fa-file-circle-xmark"></i>
                            </template>
                            <template v-else-if="log.type.includes('ModuleNotFoundError')">
                                <i class="fa-solid fa-file-import"></i>
                            </template>
                            <template v-else-if="log.type.includes('ZeroDivisionError')">
                                <i class="fa-solid fa-0"></i>
                            </template>
                            <template v-else-if="log.type.includes('AssertionError')">
                                <i class="fa-solid fa-triangle-exclamation"></i>
                            </template>
                            <template v-else-if="log.type.includes('IndexError')">
                                <i class="fa-solid fa-hand-point-up"></i>
                            </template>
                            <template v-else-if="log.type.includes('NotImplementedError')">
                                <i class="fa-solid fa-notdef"></i>
                            </template>
                            <template v-else-if="log.type.includes('RecursionError')">
                                <i class="fa-solid fa-rotate"></i>
                            </template>
                            <template v-else-if="log.type.includes('RuntimeError')">
                                <i class="fa-solid fa-hourglass-half"></i>
                            </template>
                            <template v-else-if="log.type.includes('FileExistsError')">
                                <i class="fa-solid fa-file-circle-exclamation"></i>
                            </template>
                            <template v-else-if="log.type.includes('KeyboardInterrupt')">
                                <i class="fa-solid fa-keyboard"></i>
                            </template>
                            <template v-else-if="log.type.includes('PermissionError')">
                                <i class="fa-solid fa-shield-halved"></i>
                            </template>
                            <template v-else>
                                <i class="fas fa-exclamation-circle"></i>
                            </template>
                            {{ log.type }}:
                        </div>
                        <div class="w-full whitespace-pre">
                            <span v-if="log.msg.includes('^')">
                                <span class="text-fuchsia-700 dark:text-fuchsia-400">{{ getFirstLogPart(log) }}</span>
                                <span class="text-rose-500 dark:text-rose-600 underline decoration-wavy">{{ getunderlinedPart(log) }}</span>
                                <span class="text-fuchsia-700 dark:text-fuchsia-400">{{ getSecondLogPart(log) }}</span>
                                <b class="text-slate-900 dark:text-slate-100">{{ getLogArrows(log) }}</b>
                            </span>
                            <span v-else>
                                <span class="text-fuchsia-700 dark:text-fuchsia-400">{{ log.msg }}</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    methods: {
        getOutputType() {
            const lang = {
                "c_cpp": "Cout",
                "javascript": "Console log",
                "python": "Print",
            }
            return lang[examStore.options.evaluator];
        },
        getFirstLogPart(log) {
            switch (examStore.options.evaluator) {
                case "c_cpp":
                    return this.getLogText(log).slice(0, this.getLogArrowsFirstLength(log)+log.msg.split("\n")[0].length+1);
                case "javascript":
                    return this.getLogText(log).slice(0, this.getLogArrowsFirstLength(log));
                case "python":
                    return this.getLogText(log).slice(0, this.getLogArrowsFirstLength(log));
            }
        },
        getunderlinedPart(log) {
            switch (examStore.options.evaluator) {
                case "c_cpp":
                    return this.getLogText(log).slice(this.getFirstLogPart(log).length, this.getFirstLogPart(log).length+this.getLogArrowsLength(log));
                case "javascript":
                    return this.getLogText(log).slice(this.getLogArrowsFirstLength(log), this.getLogArrowsFirstLength(log)+this.getLogArrowsLength(log));
                case "python":
                    return this.getLogText(log).slice(this.getLogArrowsFirstLength(log), this.getLogArrowsFirstLength(log)+this.getLogArrowsLength(log));
            }
        },
        getSecondLogPart(log) {
            switch (examStore.options.evaluator) {
                case "c_cpp":
                    return this.getLogText(log).slice(this.getFirstLogPart(log).length+1);
                case "javascript":
                    return this.getLogText(log).slice(this.getLogArrowsFirstLength(log)+this.getLogArrowsLength(log));
                case "python":
                    return this.getLogText(log).slice(this.getLogArrowsFirstLength(log)+this.getLogArrowsLength(log));
            }
        },
        getLogText(log) {
            switch (examStore.options.evaluator) {
                case "c_cpp":
                    return log.msg.replace(/\^+\s*/,'');
                case "javascript":
                    return log.msg.replace(/\s*\^+\s*/,'');
                case "python":
                    return log.msg.replace(/\s*\^+\s*/,'');
            }
        },
        getLogArrows(log) {
            switch (examStore.options.evaluator) {
                case "c_cpp":
                    return (log.msg.split("\n")[2])?.replace(/\s*.*\s/,'');
                case "javascript":
                    return log.msg.replace(/\s*.*\s/,'');
                case "python":
                    return log.msg.replace(/\s*.*\s/,'');
            }
        },
        getLogArrowsLength(log) {
            return log.msg.replace(/[^\^]/g,'').length;
        },
        getLogArrowsFirstLength(log) {
            switch (examStore.options.evaluator) {
                case "c_cpp":
                    return log.msg.replace(/\s*.*\s*.*\s/,'').replace(/\^+\s*/,'').length-1;
                case "javascript":
                    return log.msg.replace(/\s*.*\s/,'').replace(/\^+\s*/,'').length-1;
                case "python":
                    return log.msg.replace(/\s*.*\s/,'').replace(/\^+\s*/,'').length-1;
            }
        },
        newValueFormatted(log) {
            try {
                return JSON.parse(log)
            } catch (error) {
                if (log == undefined) return "undefined"
                return log
            }
        },
        formatedExamLogMessages() {
            // Initialize an empty object to store counts
            const logMessages = examStore.logMessages;
            const counts = {};

            // Iterate through logMessages array and count occurrences
            logMessages.forEach(message => {
                const key = JSON.stringify(message); // Use JSON.stringify to create a unique key for each object
                counts[key] = (counts[key] || 0) + 1;
            });

            // Create a new array with grouped objects and count field
            const groupedMessages = Object.keys(counts).map(key => {
                const obj = JSON.parse(key); // Parse the key back to an object
                return { ...obj, count: counts[key] };
            });
            return globalStore.groupLogMessaged ? groupedMessages : logMessages
        }
    }
}
</script>
