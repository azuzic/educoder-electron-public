<script setup>
import { onMounted } from "vue"
import { globalStore, adminStore } from "@/main.js";
onMounted(() => {
    window.alert = function(message) {
        var modal = document.getElementById("customAlertPopup");
        var messageElement = document.getElementById("customAlertMessage");
        messageElement.innerHTML = message;
        modal.style.display = "block";

        var closeButton = document.getElementById("customAlertClose");

        closeButton.onclick = function() {
            modal.style.display = "none";
        }
    };
    window.prompt = function(message, defaultValue = '') {
        return new Promise((resolve, reject) => {
            var modal = document.getElementById("customPrompt");
            var messageElement = document.getElementById("promptMessage");
            var inputElement = document.getElementById("promptInput");
            var cancelButton = document.getElementById("promptCancel");
            var confirmButton = document.getElementById("promptConfirm");
            messageElement.textContent = message;
            inputElement.value = defaultValue;
            modal.style.display = "block";
            cancelButton.onclick = function() {
                modal.style.display = "none";
                reject("Prompt canceled");
            }
            confirmButton.onclick = function() {
                modal.style.display = "none";
                resolve(inputElement.value);
            }
        });
    };
});
</script>

<template>

    <div v-if="!['Debug', 'Under Maintenance'].includes($route.name)" :class="globalStore.isDarkMode ? 'dark' : ''">
        <EC_DarkModeToggle/>
        <EC_Debug/>
        <EC_Popups/>
        <EC_Tooltip/>
        <EC_VisibilityAuthChange/>
        <EC_Alert/>
    </div>

	<div class="wh-full relative | transition-300 overflow-auto"
        :class="[globalStore.isDarkMode ? 'dark bg-neutral-800' : 'bg-neutral-100',
                 globalStore.themeChanging ? 'themeChanging' : '',
                 adminStore.updating ? 'cursor-progress' : '']">

		<div class="min-h-full flex flex-col absolute w-full">
            <EC_Header v-if="!['Exam', 'Debug', 'Under Maintenance', 'Sign In', 'Batch Examination'].includes($route.name)" />

            <router-view class="" v-slot="{ Component, route }">
                <transition name="fade">
                    <component class="absolute wh-full" :class="!['Exam', 'Batch Examination'].includes($route.name)? 'pt-16' : ''" :is="Component" :key="route.path" />
                </transition>
            </router-view>
		</div>
	</div>

</template>
