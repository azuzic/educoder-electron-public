<script setup>
import { userStore, examStore } from "@/main.js";
</script>

<template>
	<div class="flex items-center justify-end h-full">
		<div class="relative h-full flex-center gap-2">
			<div class="flex flex-col items-end h-full justify-center">
				<div v-if="userStore.user.email">{{ userStore.user.email }}</div>
				<EC_ButtonGoogle v-if="!userStore.user.email" @click="userStore.openSignInBrowserPage();"/>
				<EC_Button class="w-fit" bg="text-rose-200 bg-rose-700 hover:bg-rose-600" :disabled="examStore.examInProgress" v-else @click="userStore.handleSignOut()"> Odjava </EC_Button>
			</div>
		</div>
	</div>
</template>