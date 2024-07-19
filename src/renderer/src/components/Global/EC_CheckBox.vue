<script setup>
import { defineModel } from 'vue';

const props = defineProps(['label']);
const model = defineModel([Number, String, Boolean]);

function update(value) {
    model.value = value;
}
</script>
<template>
    <div class="inline-flex items-center">
        <label class="relative flex items-center justify-center p-1 rounded-full cursor-pointer group" :htmlFor="checkID">
            <input type="checkbox" v-model="model" @click="update(model);"
                class="before:content[''] relative h-4 w-4 cursor-pointer appearance-none rounded border border-gray-700 dark:border-gray-400
                    transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-7 
                    before:w-7 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full dark:bg-
                    before:bg-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900
                   checked:before:bg-gray-700 group-hover:before:opacity-10"
                    :class="model ? 'bg-green-500 dark:bg-green-600' : 'bg-rose-400 dark:bg-rose-600'"
                    :id="checkID" />
                <i v-if="model" class="fa-solid fa-check absolute text-black dark:text-white text-[10px] ml-[0px]"></i>
                <i v-else class="fa-solid fa-xmark absolute text-black dark:text-white text-[10px] ml-[0px] dark:ml-[1px]"></i>
        </label>
        <label class="mt-px font-light text-neutral-600 dark:text-neutral-300 cursor-pointer select-none" :htmlFor="checkID">
            {{ label }}
        </label>
    </div> 
</template>
<script>
import cryptoRandomString from "crypto-random-string";
export default { 
    data() { return{ checkID: cryptoRandomString({ length: 10, type: "alphanumeric" }) } }
};
</script>