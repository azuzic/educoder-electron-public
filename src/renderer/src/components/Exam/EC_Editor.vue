<script setup>
import { globalStore, examStore } from "@/main.js"  
import EC_ExamHeader from "@/components/Exam/EC_ExamHeader.vue"
</script>
<template>    
    <div class="wh-full flex-col">
        <EC_ExamHeader/>
        <div class="w-full flex overflow-hidden" :style="examStore.examSet ? 'height: calc(100% - 88px);' : 'height: calc(100% - 40px);'">
            <draggable v-if="!globalStore.refreshDraggable[0]" id="draggableid1" class="flex flex-col h-full w-0"
                :class="globalStore.draggable1.length > 0 ? 'resize-horizontal' : ''" handle=".handle"
                :style="[globalStore.draggable1.length > 0 ? 'width: 10%;' : 'width: 0%; ', globalStore.isDarkMode ? 'background-color: #171717;' : 'background-color: lightgrey;']"
                :list="globalStore.draggable1" item-key="id" :group="'windows'">
                <template #item="{ element, index }">
                    <EC_Window :type="element.type" :last="index != globalStore.draggable1.length-1" :total="globalStore.draggable1.length == 0 ? 1 : globalStore.draggable1.length"
                    :index="index" :previous="null" :next="globalStore.draggable2" :current="globalStore.draggable1"/>
                </template>
            </draggable>

            <draggable v-if="!globalStore.refreshDraggable[1]" id="draggableid2" class="flex flex-col h-full w-0" handle=".handle"
                :class="[globalStore.draggable2.length > 0 && globalStore.draggable2.length != 5 ? 'border-l-4 border-neutral-300 dark:border-neutral-900' : '',
                    globalStore.draggable2.length > 0 && (globalStore.draggable3.length > 0 || globalStore.draggable4.length > 0) ? 'resize-horizontal' : globalStore.draggable2.length > 0 ? 'grow' : '']"
                :style="[globalStore.draggable2.length > 0 ? 'width: 50%;' : 'width: 0%; ', globalStore.isDarkMode ? 'background-color: #171717;' : 'background-color: lightgrey;']"
                :list="globalStore.draggable2" item-key="id" :group="'windows'">
                <template #item="{ element, index }">
                    <EC_Window :type="element.type" :last="index != globalStore.draggable2.length-1"  :total="globalStore.draggable2.length == 0 ? 1 : globalStore.draggable2.length"
                    :index="index" :previous="globalStore.draggable1" :next="globalStore.draggable3" :current="globalStore.draggable2"/>
                </template>
            </draggable>

            <draggable v-if="!globalStore.refreshDraggable[2]" id="draggableid3" class="flex flex-col h-full w-0" handle=".handle"
                :class="[globalStore.draggable3.length > 0 && globalStore.draggable2.length != 5 ? 'border-l-4 border-neutral-300 dark:border-neutral-900' : '',
                    globalStore.draggable3.length > 0 && globalStore.draggable4.length > 0 ? 'resize-horizontal' : globalStore.draggable3.length > 0 ? 'grow' : '']"
                :style="[globalStore.draggable3.length > 0 ? 'width: 10%;' : 'width: 0%;', globalStore.isDarkMode ? 'background-color: #171717;' : 'background-color: lightgrey;']"
                :list="globalStore.draggable3" item-key="id" :group="'windows'">
                <template #item="{ element, index }">
                    <EC_Window :type="element.type" :last="index != globalStore.draggable3.length-1"  :total="globalStore.draggable3.length == 0 ? 1 : globalStore.draggable3.length"
                    :index="index" :previous="globalStore.draggable2" :next="globalStore.draggable4" :current="globalStore.draggable3"/>
                </template>
            </draggable>   
            
            <draggable v-if="!globalStore.refreshDraggable[3]" id="draggableid4" class="flex flex-col h-full w-0" handle=".handle"
                :class="[globalStore.draggable4.length > 0 && globalStore.draggable2.length != 5 ? 'border-l-4 border-neutral-300 dark:border-neutral-900' : '', globalStore.draggable4.length > 0 ? 'grow' : '']"
                :style="[globalStore.draggable4.length > 0 ? 'width: 10%;' : 'width: 0%;', globalStore.isDarkMode ? 'background-color: #171717;' : 'background-color: lightgrey;']"
                :list="globalStore.draggable4" item-key="id" :group="'windows'">
                <template #item="{ element, index }">
                    <EC_Window :type="element.type" :last="index != globalStore.draggable4.length-1"  :total="globalStore.draggable4.length == 0 ? 1 : globalStore.draggable4.length"
                    :index="index" :previous="globalStore.draggable3" :next="null" :current="globalStore.draggable4"/>
                </template>
            </draggable>
        </div>
    </div>
</template>