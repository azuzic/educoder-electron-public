<script setup>
import { globalStore } from "@/main.js"  
</script>
<template>    
    <div :id="type" class="relative flex flex-col" :class="[last ? 'resize-vertical window' : 'grow h-0']">
        <div :class="globalStore.isDragging ? '' : 'pointer-events-none'"
            class="absolute wh-full z-30"></div>
        
        <div class="dark:bg-neutral-900 dark:text-neutral-400 text-neutral-700 bg-neutral-300 handle flex justify-between items-center group px-1 min-w-fit z-40"
            @mousedown="globalStore.initiateDragging()">

            <div class="flex-center gap-1 w-fit opacity-0 group-hover:opacity-100 transition-300">
                <i v-if="current && previous" class="fa-regular fa-circle-left window-button active:scale-90" @click="shiftLeft(); globalStore.setTooltip();" 
                    @mouseover="globalStore.setTooltip('Pomakni prozor lijevo', 'top', 'text-center')"
                    @mouseleave="globalStore.setTooltip()"></i>
                <i v-if="current && index != total-1" class="fa-regular fa-circle-down window-button active:scale-90" @click="shiftDown(); globalStore.setTooltip();" 
                    @mouseover="globalStore.setTooltip('Pomakni prozor dolje', 'top', 'text-center')"
                    @mouseleave="globalStore.setTooltip()"></i>
                <i v-if="current && index != 0" class="fa-regular fa-circle-up window-button active:scale-90" @click="shiftUp(); globalStore.setTooltip();" 
                    @mouseover="globalStore.setTooltip('Pomakni prozor gore', 'top', 'text-center')"
                    @mouseleave="globalStore.setTooltip()"></i>
                <div class="w-0.5 max-w-0.5 h-4 bg-neutral-500 rounded-full mx-1 active:scale-90"></div>
                <i class="fa-regular fa-trash-can window-button" @click="removeSelf(); globalStore.windowsHidden[type] = true; globalStore.setTooltip();" 
                    @mouseover="globalStore.setTooltip('Ukloni prozor', 'top', 'text-center')"
                    @mouseleave="globalStore.setTooltip()"></i>
            </div>

            <EC_WindowTitles :type="type"/>

            <div class="flex-center gap-1 w-fit opacity-0 group-hover:opacity-100 transition-300">
                <i class="fa-solid fa-magnifying-glass-plus window-button active:scale-90" @click="globalStore.zoom(type, 2)" 
                    @mouseover="globalStore.setTooltip('Povećaj sadržaj', 'top', 'text-center')"
                    @mouseleave="globalStore.setTooltip()"></i>
                <i class="fa-solid fa-magnifying-glass-minus window-button active:scale-90" @click="globalStore.zoom(type, -2);" 
                    @mouseover="globalStore.setTooltip('Smanji sadržaj', 'top', 'text-center')"
                    @mouseleave="globalStore.setTooltip()"></i>
                <div class="w-0.5 max-w-0.5 h-4 bg-neutral-500 rounded-full mx-0.5"></div>
                <i v-if="current && index != 0" class="fa-regular fa-circle-up window-button active:scale-90" @click="shiftUp(); globalStore.setTooltip();" 
                    @mouseover="globalStore.setTooltip('Pomakni prozor gore', 'top', 'text-center')"
                    @mouseleave="globalStore.setTooltip()"></i>
                <i v-if="current && index != total-1" class="fa-regular fa-circle-down window-button active:scale-90" @click="shiftDown(); globalStore.setTooltip();" 
                    @mouseover="globalStore.setTooltip('Pomakni prozor dolje', 'top', 'text-center')"
                    @mouseleave="globalStore.setTooltip()"></i>
                <i v-if="current && next" class="fa-regular fa-circle-right window-button active:scale-90" @click="shiftRight(); globalStore.setTooltip();" 
                    @mouseover="globalStore.setTooltip('Pomakni prozor desno', 'top', 'text-center')"
                    @mouseleave="globalStore.setTooltip()"></i>
            </div>

        </div>
        
        <EC_HTML_Editor v-if="type == 'HTML'"/>
        <EC_JS_Editor v-if="type == 'JS'"/>
        <EC_Preview v-if="type == 'PREVIEW'"/>
        <EC_Markdown v-if="type == 'MARKDOWN'"/>
        <EC_Log v-if="type == 'LOG'"/>

    </div>
</template>
<script>
import { globalStore } from "@/main.js"  
import "@/scripts/ace-config";

export default {
    name: "Window",    
    props: {
        type: String,
        last: Boolean,
        index: Number,
        total: Number,
        previous: Array,
        next: Array,
        current: Array
    },
    mounted() {
        if (!this.last) return;
        let doc = document.getElementById(this.type)
        let newSize = 100 / this.total;
        doc.style.height = newSize + "%";
    },
    methods: {
        handlePreviewClick(event) {
            event.stopPropagation();
        },
        async removeSelf() {
            globalStore.initiateDragging();
            for (let i = 0; i < this.current.length; i++)
                if (this.current[i].type === this.type) {
                    this.current.splice(i, 1)[0];
                    break;
                }
        },
        async shiftRight() {
            globalStore.initiateDragging();
            let removedElement;
            for (let i = 0; i < this.current.length; i++)
                if (this.current[i].type === this.type) {
                    removedElement = this.current.splice(i, 1)[0];
                    break;
                }
            if (removedElement) this.next.push(removedElement);
        },
        async shiftLeft() {
            globalStore.initiateDragging();
            let removedElement;
            for (let i = 0; i < this.current.length; i++)
                if (this.current[i].type === this.type) {
                    removedElement = this.current.splice(i, 1)[0];
                    break;
                }
            if (removedElement) this.previous.push(removedElement);
        },
        async shiftUp() {
            globalStore.initiateDragging();
            let removedElement;
            for (let i = 0; i < this.current.length; i++)
                if (this.current[i].type === this.type) {
                    removedElement = this.current.splice(i, 1)[0];
                    if (i > 0) this.current.splice(i - 1, 0, removedElement);
                    else this.current.push(removedElement);                    
                    break;
                }
        },
        async shiftDown() {
            globalStore.initiateDragging();
            let removedElement;
            for (let i = 0; i < this.current.length; i++)
                if (this.current[i].type === this.type) {
                    removedElement = this.current.splice(i, 1)[0];
                    if (i < this.current.length) this.current.splice(i + 1, 0, removedElement);
                    else this.current.unshift(removedElement);
                    break;
                }
        }
    }
};
</script>