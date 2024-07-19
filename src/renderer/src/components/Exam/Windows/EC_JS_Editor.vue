<template>
	<v-ace-editor
		v-if="examStore.solutions.length > 0"
		v-model:value="examStore.solutions[examStore.currentSolution - 1].js_code"
		class="grow"
		:style="'font-size: ' + globalStore.JSfontSize + 'px;'"
		:lang="examStore.options.evaluator"
		:theme="globalStore.isDarkMode ? globalStore.selectedDarkTheme : globalStore.selectedLightTheme"
		@keyup="examStore.options.autoEvaluation ? examStore.evaluateCode() : ''"
		:options="{
			useWorker: true,
			enableBasicAutocompletion: true,
			enableSnippets: true,
			enableLiveAutocompletion: true,
			tabSize: globalStore.JStabSize,
		}"
		@init="setupEditor" />
</template>
<script>
import { globalStore, examStore } from "@/main.js";
import "@/scripts/ace-config";
import { EXAM_MSGS } from "@/scripts/messages.js"

export default {
	name: "HomeView",
	setup() {
		return { globalStore, examStore };
	},
	mounted() {
		document.addEventListener("keydown", this.handleKeyDown);
	},
	beforeDestroy() {
		document.removeEventListener("keydown", this.handleKeyDown);
	},
	methods: {
		setupEditor(editor) {
			const maxPasteLength = 400;
			editor.on("paste", function (e) {
				const beforePasteContent = editor.getValue();
				setTimeout( async () => {
					const currentContent = editor.getValue();
                    const preventPaste = currentContent.length - beforePasteContent.length > maxPasteLength && examStore.antiCheatCopyPasteLimitEnabled;
					if (preventPaste && examStore.EDU_CODER_MODE != "SANDBOX") {
                        const clipboardText = e.text.replace(/\s*/g, "");
                        const copiedCode = examStore.copiedCode.replace(/\s*/g, "");
                        if (clipboardText != copiedCode) {
                            editor.setValue(beforePasteContent, 1);
                            globalStore.pushPopup(EXAM_MSGS.EXAM_ANTI_CHEAT_MAX_PASTE_LIMIT__WARNING(maxPasteLength));
                        }
                    }
				}, 1);
			});
		},
		handleKeyDown(event) {
            const altKey_n = event.altKey && event.key === "n";
            const ctrlKey_metaKey_enter = (event.ctrlKey || event.metaKey) && event.key === "Enter";
			if (altKey_n || ctrlKey_metaKey_enter) {
				event.preventDefault();
				this.examStore.evaluateCode();
			}
		},
	},
};
</script>
