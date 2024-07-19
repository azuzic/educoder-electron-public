<script setup>
import { globalStore } from "@/main.js";
defineProps({
	name: {
		type: String,
		default: "",
	},
});
</script>
<template>
	<div :class="globalStore.storeSelected == name ? 'text-fipu_blue underline' : 'hover:text-sky-600 cursor-pointer'"  
        @click="globalStore.storeSelected = name" class="px-4 py-1 font-medium">
		{{ name }}
	</div>
</template>