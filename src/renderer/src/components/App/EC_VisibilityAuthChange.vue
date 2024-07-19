<script setup>
import { globalStore, userStore, examStore } from "@/main.js";
import { onMounted } from "vue";
import { auth, onAuthStateChanged } from "@/scripts/firebase.js";
import alertSFX from "@/assets/alert.mp3";
import { EXAM_MSGS } from "@/scripts/messages.js";

const EduCoderVersion = "1.7.1"; //ACTUAL VERSION
const UnderConsturction = false;

const handleMouseUp = () => {
	globalStore.isDragging = false;
};

const antiCheatDetection = (e) => {
    // Don't do anti-cheat checks in sandbox mode or if the exam is not in progress
	if (!examStore.examInProgress || examStore.EDU_CODER_MODE === "SANDBOX") return;
    if (!examStore.antiCheatDetectionEnabled || examStore.mouseOnIframe) return;


	if (!examStore.upozorenje && !examStore.preventUpozorenje) {
		examStore.upozorenje = true;
		examStore.preventUpozorenje = true;
		return;
	} else {
		if (examStore.preventUpozorenje) {
			globalStore.pushPopup(EXAM_MSGS.EXAM_ANTI_CHEAT_EXIT__WARNING);
			const alertAudio = new Audio(alertSFX);
			alertAudio.play();
			examStore.preventUpozorenje = false;
		} else examStore.endExam({ requireConfirmation: false });
	}
};

onMounted(() => {
    // USER LOGIN
    if (window.api != undefined) {
        window.api.onTokenReceived((event, value) => {
            userStore.logIn(value);
        })
    }

    // RESET TOOLTIP
    globalStore.setTooltip();

	// EXAM RESET
	if (!examStore.examInProgress) if (examStore.EDU_CODER_MODE != "SANDBOX") examStore.resetAndClear();

	// APP VERSION
	if (globalStore.EduCoderVersion != EduCoderVersion) userStore.handleSignOut({ forceLogOut: true, EduCoderVersion: EduCoderVersion });

	// MAKE APP UNAVAILABLE
	if (globalStore.UnderConsturction != UnderConsturction) {
		globalStore.UnderConsturction = UnderConsturction;
		userStore.handleSignOut({ forceLogOut: true, EduCoderVersion: EduCoderVersion });
	}

	// DARK MODE
	if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches && !userStore.user.email) globalStore.isDarkMode = true;

	// WINDOW DRAGGING
	window.addEventListener("mouseup", handleMouseUp);

	// ANTI CHEAT
	window.addEventListener("blur", antiCheatDetection);

	// DISABLE SAVE AND REFRESH SHORTCUTS
	document.addEventListener(
		"keydown",
		function (e) {
			if ((e.ctrlKey || e.metaKey || e.altKey) && !["c", "-", "+", "0", "f11", "x", "v", "<", ">", "{", "}", "enter", "meta", "ctrl", "alt", "dead", "|", "[", "]", "\\", "^"].includes(e.key.toLowerCase())) e.preventDefault();
			else if (["f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "f10", "f12"].includes(e?.key?.toLowerCase() != undefined ? e.key.toLowerCase() : "")) e.preventDefault();
		},
		false
	);

	// FETCH SCRIPTS FROM GITHUB
	//getScripts()

	return () => {
		window.removeEventListener("mouseup", handleMouseUp);
		onAuthStateChanged(auth, userStore.handleAuthStateChanged);
	};
});
</script>
<template></template>
