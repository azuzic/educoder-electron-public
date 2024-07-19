
<script setup>
import { defineModel } from 'vue';

const props = defineProps(['labelName', 'emitName', 'list', 'l', 'label']);
const model = defineModel();

function update(value) {
    model.value = value;
}
</script>

<template>
    <div class="flex gap-2 items-center">
        <div class="relative z-20 w-full group">
            <input v-model="model" @focusout="!focus ? show = false : ''" @click="show = true" readonly
            class="block py-0.5 w-full text-xs dark:bg-neutral-700 dark:group-hover:bg-neutral-600 bg-neutral-300 group-hover:bg-neutral-50
            rounded px-2 appearance-none focus:outline-none focus:ring-0 peer caret-transparent text-transparent cursor-default outline-none"
            :class="l ? 'py-2.5' : 'py-0.5'"/>

            <div class="absolute top-0 left-0 w-full h-full overflow-x-auto whitespace-nowrap scrollbar-none text-xs py-0.5 px-2
                text-neutral-800 dark:text-neutral-300 pointer-events-none">
                {{ labelName && model ? model[labelName] : model }}
            </div>
                        
            <div class="absolute flex justify-center h-full aspect-square items-center top-0 right-0 rounded overflow-hidden pointer-events-none">
                <div class="absolute bg-neutral-300 dark:bg-neutral-700 group-hover:bg-neutral-50 group-hover:dark:bg-neutral-600 flex
                    justify-center items-center h-full px-0.5 aspect-square">
                    <i class="fa-solid fa-caret-down transition-all duration-300 cursor-pointer"
                        :class="[show ? 'dark:text-neutral-200 text-neutral-600 -scale-y-100' : 'dark:text-neutral-200 text-neutral-600',
                        l ? 'top-2 text-sm' : 'top-0.5 text-xs']"></i>
                </div>
            </div>

            <div @mouseleave="focus = false" @mouseenter="focus = true" :class="show ? 'h-fit max-h-64 opacity-100' : 'h-0 opacity-0'"
                class="w-fit mt-2 | bg-neutral-200 dark:bg-neutral-700 | drop-shadow-lg rounded | overflow-hidden | transition-opacity duration-300 | absolute overflow-y-auto">
                <ul class="z-50 w-fit" aria-labelledby="dropdownDefaultButton drop-shadow-lg">
                    <div v-for="v, id in  list" @click="show = false; update(emitName ? v[emitName] : v)"
                        class="block px-2 hover:bg-neutral-600 dark:hover:bg-neutral-200 cursor-pointer
                         hover:text-neutral-200 dark:hover:text-neutral-700 z-50 whitespace-nowrap text-left"
                        :class="[(labelName ? v[labelName] : v) == model ? 'bg-sky-500 dark:text-neutral-900 text-neutral-100 font-bold' : 'text-neutral-700 dark:text-neutral-200',
                        l ? 'py-2 text-sm' : 'py-0.5 text-xs ']">
                        {{ labelName ? v[labelName] : v }}  
                    </div>   
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Dropdown.vue",
    data() {
        return {
            show: false,
            focus: false
        }
    },    
}
</script>