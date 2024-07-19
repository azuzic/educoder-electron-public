<script setup>
import { computed } from "vue";
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";
import Slider from "@vueform/slider";

import { globalStore, examStore, userStore, fileStore, adminStore, testingStore } from "@/main.js";

const storeNames = ["globalStore", "examStore", "userStore", "fileStore", "adminStore", "testingStore"];

const newValueFormatted = computed(() => {
	switch (globalStore.storeSelected) {
		case "globalStore":
			return globalStore.$state;
		case "examStore":
			return examStore.$state;
		case "userStore":
			return userStore.$state;
		case "fileStore":
			return fileStore.$state;
		case "adminStore":
			return adminStore.$state;
		case "testingStore":
			return testingStore.$state;
	}
});
</script>

<template>
	<div v-if="globalStore.debugOpen && [].includes(userStore.user.email)" class="w-screen h-screen flex justify-center items-center fixed backdrop-blur-sm z-[1000] py-16 px-[8%]">
		<div class="p-4 flex flex-col dark:bg-black bg-white bg-opacity-90 shadow-xl rounded-xl wh-full dark:text-slate-400 text-slate-800">
			<div class="text-center text-2xl font-bold">DEBUG INFO</div>
			<Slider class="my-4 slider dark:slider2 min-h-[8px] h-[8px] w-64 self-center" v-model="globalStore.depth" :min="1" :max="8" showTooltip="focus" :merge="1" :lazy="false" />
			<div class="w-full flex justify-start items-center overflow-y-hidden overflow-x-auto py-4 min-h-[24px] max-h-[24px] border-y border-slate-600">
				<EC_DebugSelectButton v-for="name in storeNames" :name="name" />
			</div>
			<div class="flex gap-1 h-full overflow-hidden border-b border-slate-600">
				<vue-json-pretty showIcon :deep="globalStore.depth" :data="newValueFormatted" class="w-1/2 overflow-auto h-full"/>
                <div class="h-full w-1/2 overflow-auto flex flex-col border-l border-slate-600">
                    <div class="font-bold py-2 text-base text-center text-rose-500 bg-rose-500 bg-opacity-10 border-b border-slate-600">
                        Be careful when directly modifying variables & calling functions in this context!
                    </div>
                    <div class="rounded overflow-auto p-1 h-full">
                        <EC_EditExamStore/>
                        <EC_EditUserStore/>
                        <EC_EditFileStore/>
                        <EC_EditGlobalStore/>
                        <EC_EditAdminStore/>
                        <EC_EditTestingStore/>
                    </div>
                </div>
			</div>
		</div>
	</div>

    <div v-if="[].includes(userStore.user.email)" class="fixed bottom-2 right-2 z-[2000]" @click="globalStore.debugOpen = !globalStore.debugOpen">
        <i class="fa-solid fa-circle-question hover:brightness-125 text-4xl hover:cursor-pointer mr-2 opacity-50"
        :class="!globalStore.debugOpen ? 'text-rose-700 ' : 'text-green-700 '"></i>
    </div>
</template>

<style src="@vueform/slider/themes/default.css"></style>
<style>
.vjs-tree-node:hover {
	background: rgba(255, 255, 255, 0.1) !important;
}
.slider {
	--slider-bg: #808080;
	--slider-connect-bg: #14b35b;
	--slider-tooltip-bg: #14b35b;
}
</style>
