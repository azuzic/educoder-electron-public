<script setup>
import { globalStore, examStore } from "@/main.js";
</script>

<template>
    <div v-if="globalStore.storeSelected == 'examStore'" class="flex flex-col gap-0.5 text-sm">
        <EC_Button class="w-48" bg="red" @click="examStore.RESET_TO_DEFAULT_VALUES()"> RESET_TO_DEFAULT_VALUES </EC_Button>
        <div class="flex gap-2">
            <EC_Dropdown v-model="examStore.EDU_CODER_MODE" class="w-48"
                :list="['IDLE', 'EXAM_WITH_TIME_LIMIT', 'EXAM_WITHOUT_TIME_LIMIT', 'PRACTICE_WITH_TIME_LIMIT', 'PRACTICE_WITHOUT_TIME_LIMIT', 'SANDBOX']"/>
            EDU_CODER_MODE
        </div>
        <div class="bg-rose-400/25 border-y-2 border-neutral-500 flex flex-col w-full py-1 my-2">
            <EC_CheckBox v-model="examStore.localExamDownloadEnabled" label="localExamDownloadEnabled" />
            <EC_CheckBox v-model="examStore.antiCheatDetectionEnabled" label="antiCheatDetectionEnabled" />
            <EC_CheckBox v-model="examStore.antiCheatCopyPasteLimitEnabled" label="antiCheatCopyPasteLimitEnabled" />
            <EC_CheckBox v-model="examStore.bypassTimeCheckEnabled" label="bypassTimeCheckEnabled" />
            <EC_CheckBox v-model="examStore.bypassExamAccessLimitEnabled" label="bypassExamAccessLimitEnabled" />
        </div>
        <EC_CheckBox v-model="examStore.examSet" label="examSet" />
        <EC_CheckBox v-model="examStore.examInProgress" label="examInProgress" />
        <EC_CheckBox v-model="examStore.mouseOnIframe" label="mouseOnIframe" />

        <div class="flex items-center gap-2">
            <EC_Input class="w-48 h-5 rounded" type="number" v-model="examStore.examStartTime" />
            examStartTime
        </div>
        <div class="flex items-center gap-2">
            <EC_Input class="w-48 h-5 rounded" type="number" v-model="examStore.remainingTime" />
            remainingTime
        </div>
        <div class="flex gap-2">
            <EC_Dropdown v-model="examStore.codeAlert" class="w-48"
                :list="['braces', 'error', 'good', 'loop', 'error']"/>
            codeAlert
        </div>
        <div class="flex gap-2">
            <EC_Dropdown v-model="examStore.markdownTab" class="w-48"
                :list="['script', 'task']"/>
            markdownTab
        </div>
        <EC_CheckBox v-model="examStore.options.autoEvaluation" label="options.autoEvaluation" />
        <div class="flex gap-2">
            <EC_Dropdown v-model="examStore.options.maxIterations" class="w-48"
                :list="['100', '250', '500', '1000', '1500', '2000']"/>
            options.maxIterations
        </div>
        <div class="flex flex-col w-fit gap-0.5 mt-1 bg-black dark:bg-white dark:bg-opacity-10 bg-opacity-10 p-1 rounded">
            <EC_Button class="w-48" bg="blue" @click="examStore.SET_EduCoder_MODE({mode: mode, timeLimit: timeLimit, accessLimit: accessLimit})"> SET_EduCoder_MODE </EC_Button>
            <div class="flex gap-2">
                <EC_Dropdown v-model="mode" class="w-24"
                    :list="['null', 'IDLE', 'EXAM_WITH_TIME_LIMIT', 'EXAM_WITHOUT_TIME_LIMIT', 'PRACTICE_WITH_TIME_LIMIT', 'PRACTICE_WITHOUT_TIME_LIMIT', 'SANDBOX']"/>
                    mode
            </div>
            <div class="flex items-center gap-2">
                <EC_Input class="w-24 h-5 rounded" type="number" v-model="timeLimit" />
                timeLimit
            </div>
            <div class="flex items-center gap-2">
                <EC_Input class="w-24 h-5 rounded" type="number" v-model="accessLimit" />
                accessLimit
            </div>
        </div>
        <div class="flex flex-col w-fit gap-0.5 mt-1 bg-black dark:bg-white dark:bg-opacity-10 bg-opacity-10 p-1 rounded">
            <EC_Button class="w-48" bg="blue" @click="description = examStore.getExamDescription()"> getExamDescription </EC_Button>
            {{description}}
        </div>
        <div class="flex flex-col w-fit gap-0.5 mt-1 bg-black dark:bg-white dark:bg-opacity-10 bg-opacity-10 p-1 rounded">
            <EC_Button class="w-48" bg="blue" @click="examStore.fetchExamDataFromFirestore(password)"> fetchExamDataFromFirestore </EC_Button>
            <div class="flex items-center gap-2">
                <EC_Input class="w-24 h-5 rounded" v-model="password" />
                password
            </div>
        </div>
        <div class="flex flex-col w-fit gap-0.5 mt-1 bg-black dark:bg-white dark:bg-opacity-10 bg-opacity-10 p-1 rounded">
            <EC_Button class="w-48" bg="red" @click="examStore.clearExamData()"> clearExamData </EC_Button>
        </div>
        <div class="flex flex-col w-fit gap-0.5 mt-1 bg-black dark:bg-white dark:bg-opacity-10 bg-opacity-10 p-1 rounded">
            <EC_Button class="w-48" bg="blue" @click="examStore.fillTasks()"> fillTasks </EC_Button>
        </div>
        <div class="flex flex-col w-fit gap-0.5 mt-1 bg-black dark:bg-white dark:bg-opacity-10 bg-opacity-10 p-1 rounded">
            <EC_Button class="w-48" bg="blue" @click="examStore.evaluateCode()"> evaluateCode </EC_Button>
        </div>
        <div class="flex flex-col w-fit gap-0.5 mt-1 bg-black dark:bg-white dark:bg-opacity-10 bg-opacity-10 p-1 rounded">
            <EC_Button class="w-48" bg="red" @click="examStore.resetAndClear()"> resetAndClear </EC_Button>
        </div>
        <div class="flex flex-col w-fit gap-0.5 mt-1 bg-black dark:bg-white dark:bg-opacity-10 bg-opacity-10 p-1 rounded">
            <EC_Button class="w-48" bg="green" @click="examStore.startExam()"> startExam </EC_Button>
        </div>
        <div class="flex flex-col w-fit gap-0.5 mt-1 bg-black dark:bg-white dark:bg-opacity-10 bg-opacity-10 p-1 rounded">
            <EC_Button class="w-48" bg="blue" @click="examStore.setupTimer()"> setupTimer </EC_Button>
        </div>
        <div class="flex flex-col w-fit gap-0.5 mt-1 bg-black dark:bg-white dark:bg-opacity-10 bg-opacity-10 p-1 rounded">
            <EC_Button class="w-48" bg="red" @click="examStore.endExam({ requireConfirmation: requireConfirmation })"> endExam </EC_Button>
            <EC_CheckBox v-model="requireConfirmation" label="requireConfirmation" />
        </div>
        <div class="flex flex-col w-fit gap-0.5 mt-1 bg-black dark:bg-white dark:bg-opacity-10 bg-opacity-10 p-1 rounded">
            <EC_Button class="w-48" bg="green" @click="examStore.enterSandbox()"> enterSandbox </EC_Button>
        </div>
        <div class="flex flex-col w-fit gap-0.5 mt-1 bg-black dark:bg-white dark:bg-opacity-10 bg-opacity-10 p-1 rounded">
            <EC_Button class="w-48" bg="green" @click="examStore.downloadCode()"> downloadCode </EC_Button>
        </div>
        <div class="flex flex-col w-fit gap-0.5 mt-1 bg-black dark:bg-white dark:bg-opacity-10 bg-opacity-10 p-1 rounded">
            <EC_Button class="w-48" bg="blue" @click="examStore.setExamInstantiated(password2)"> setExamInstantiated </EC_Button>
            <div class="flex items-center gap-2">
                <EC_Input class="w-24 h-5 rounded" v-model="password2" />
                password
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
             mode: 'null',
             timeLimit: 0,
             accessLimit: 0,
             password: 'test',
             description: '',
             requireConfirmation: false,
             password2: 'test',
        }
    }
}
</script>
