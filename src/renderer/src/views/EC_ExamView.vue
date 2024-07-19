<script setup>
import { examStore, globalStore } from "@/main.js";
import alertSFX from "@/assets/alert.mp3";
import { EXAM_MSGS } from "@/scripts/messages.js";

if (examStore.examInProgress) {
    const timePassed = Math.floor((Date.now() - examStore.examStartTime) / 1000);
    const totalTime = Number(examStore.examData.timeLimit) * 60;
    const remainingTime = Math.max(totalTime - timePassed, 0);
    const difference = examStore.remainingTime - remainingTime;
    if (!examStore.antiCheatDetectionEnable) {
        if (difference > 90) !examStore.endExam({ requireConfirmation: false });
        if (difference > 30) {
            if (!examStore.upozorenje) {
                examStore.upozorenje = true;
                examStore.preventUpozorenje = true;
            } else {
                if (examStore.preventUpozorenje) {
                    globalStore.pushPopup(EXAM_MSGS.EXAM_ANTI_CHEAT_EXIT__WARNING);
                    const alertAudio = new Audio(alertSFX);
                    alertAudio.play();
                    examStore.preventUpozorenje = false;
                } else examStore.endExam({ requireConfirmation: false });
            }
        }
    }
}
</script>

<template>
	<div class="wh-full flex flex-col bg-neutral-200 dark:bg-neutral-950 text-neutral-400">
		<EC_StartExamDialog class="z-[100]" v-if="examStore.EDU_CODER_MODE === 'IDLE'" />
        <iframe v-if="globalStore.windowsHidden['PREVIEW']" class="opacity-0 pointer-events-none fixed"></iframe>
        <EC_Header />
        <EC_WindowsSettings/>
        <div class="wh-full flex flex-col overflow-hidden">
            <div class="flex h-full w-full">
                <div class="flex h-full w-full overflow-y-auto overflow-x-hidden">
                    <EC_Editor />
                </div>
            </div>
        </div>
	</div>
</template>
