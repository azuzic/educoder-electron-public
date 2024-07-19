<script setup>
import { examStore } from "@/main.js";
</script>
<template>
	<v-ace-editor
		v-if="examStore.solutions.length > 0"
		v-model:value="examStore.solutions[examStore.currentSolution - 1].html_code"
		class="grow"
		:style="'font-size: ' + globalStore.HTMLfontSize + 'px;'"
		lang="html"
		:theme="globalStore.isDarkMode ? globalStore.selectedDarkTheme : globalStore.selectedLightTheme"
		@keyup="examStore.options.autoEvaluation ? examStore.evaluateCode() : ''"
		:options="{
			useWorker: true,
			enableBasicAutocompletion: true,
			enableSnippets: true,
			enableLiveAutocompletion: true,
			tabSize: globalStore.HTMLtabSize,
		}"
		@init="setupEditor" />
</template>
<script>
import { globalStore } from "@/main.js";
import "@/scripts/ace-config";
import { EXAM_MSGS } from "@/scripts/messages.js"

export default {
	name: "HomeView",
	setup() {
		return { globalStore };
	},
	data() {
		return {
			editorOptions: {
				useWorker: true,
				enableBasicAutocompletion: true,
				enableSnippets: true,
				enableLiveAutocompletion: true,
				tabSize: globalStore.HTMLtabSize,
			},
		};
	},
	methods: {
		setupEditor(editor) {
			const maxPasteLength = 400;
			editor.on("paste", function (e) {
				const beforePasteContent = editor.getValue();
				setTimeout(() => {
					const currentContent = editor.getValue();
                    const preventPaste = currentContent.length - beforePasteContent.length > maxPasteLength && examStore.antiCheatCopyPasteLimitEnabled;
					if ( preventPaste && examStore.EDU_CODER_MODE != "SANDBOX") {
						editor.setValue(beforePasteContent, 1);
                        globalStore.pushPopup(EXAM_MSGS.EXAM_ANTI_CHEAT_MAX_PASTE_LIMIT__WARNING(maxPasteLength));	
					}
				}, 1);
			});
		},
	},
};
</script>
