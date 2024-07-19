<script setup>
import { globalStore, testingStore, examStore } from "@/main.js";
</script>

<template>
    <div v-if="globalStore.storeSelected == 'testingStore'" class="grid grid-cols-2 gap-0.5 text-sm"> 

        <div class="flex flex-col gap-0.5">
            <div class="flex items-center gap-2">
                <EC_CheckBox v-model="testingStore.stopTesting" label="stopTesting"/>
            </div>
            <div class="flex items-center gap-2">
                <EC_NumberInput class="w-48 h-5 rounded" :min="1" :max="60" v-model="testingStore.slowUnitTestSpeed" />
                slowUnitTestSpeed
            </div>

            <div class="flex flex-col w-fit gap-0.5 mt-1 bg-black dark:bg-white bg-opacity-10 dark:bg-opacity-10 p-1 rounded">
                <EC_Button class="w-48" bg="blue" @click="testingStore.loadUnitTestData()"> loadUnitTestData </EC_Button>
            </div>

            <div class="flex flex-col w-fit gap-0.5 mt-1 bg-black dark:bg-white bg-opacity-10 dark:bg-opacity-10 p-1 rounded">
                <EC_Button class="w-48" bg="green" @click="testingStore.fastUnitTest()"> fastUnitTest </EC_Button>
            </div>

            <div class="flex flex-col w-fit gap-0.5 mt-1 bg-black dark:bg-white bg-opacity-10 dark:bg-opacity-10 p-1 rounded">
                <EC_Button class="w-48" bg="yellow" @click="testingStore.slowUnitTest()"> slowUnitTest </EC_Button>
            </div>

            <div class="flex flex-col w-fit gap-0.5 mt-1 bg-black dark:bg-white bg-opacity-10 dark:bg-opacity-10 p-1 rounded">
                <EC_Button class="w-48" bg="red" @click="testingStore.stopUnitTest()"> stopUnitTest </EC_Button>
            </div>
        </div>

        <div class="flex flex-col gap-2">
            <div class="flex flex-col gap-2">
                Tests progress
                <EC_ProgressBar :current="testingStore.currentTest" :max="testingStore.tests.length" />
            </div>
            <div v-if="testingStore.currentTestName != ''" class="flex flex-col gap-2">
                Testing "{{testingStore.currentTestName}}"
                <EC_ProgressBar v-if="testingStore.currentTestProgress != 0" :current="testingStore.currentTestProgress" :max="testingStore.currentTestLength" />
            </div>
            <b v-if="testingStore.currentTestName != '' && testingStore.doneTests.length != 0">  
                <span class="text-sky-500">Total: </span> {{testingStore.doneTests.length}} <br>
                <span class="text-emerald-500">OKs:</span> {{testingStore.doneTests.filter(e => e.status == 'OK!').length}} <br>   
                <span class="text-amber-500">Max Iterations:</span> {{testingStore.doneTests.filter(e => e.status == 'Type: InternalError | Error: Max. broj iteracija dostignut!').length}} <br>         
                <span class="text-rose-500">Errors:</span> {{testingStore.doneTests.filter(e => e.status != 'Type: InternalError | Error: Max. broj iteracija dostignut!' && e.status != 'OK!').length}}                        
            </b>
            <div class="flex flex-col-reverse">
                <div v-for="result, index in testingStore.doneTests">
                    <i class="fa-regular fa-clipboard cursor-pointer mr-1 hover:text-sky-500 active:scale-75 transition-150" 
                    @click="examStore.solutions[0].js_code = testingStore.tests[index].data;"></i> 
                    <span v-if="result.status=='OK!'" class="text-emerald-500">OK!</span> 
                    <span v-else-if="result.status=='Type: InternalError | Error: Max. broj iteracija dostignut!'" class="text-amber-500">MAX IT.</span> 
                    <span v-else class="text-rose-500">{{result.status}}</span>                 
                    - 
                    <b>{{result.title}}</b>
                    
                </div>                
            </div>
        </div>

    </div>
</template> 
<script>
export default {
}
</script>