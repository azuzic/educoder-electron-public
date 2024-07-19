<template>
	<div :style="{ left: leftPosition + 'px', top: topPosition + 'px' }"
        :class="[globalStore.tooltip.content != '' ? 'opacity-100' : 'opacity-0 w-0 h-0 overflow-hidden',
        globalStore.tooltip.css]" class="z-[20000] fixed pointer-events-none flex bg-rose-500 justify-center transition-opacity duration-500">
		<div id="tooltip" class="rounded bg-neutral-800 dark:bg-neutral-300 text-neutral-300 dark:text-neutral-800 px-2 py-1 flex justify-left items-left absolute w-fit dark:border 
            border ring-1 ring-neutral-800 dark:ring-neutral-300  border-neutral-300 dark:border-neutral-800 dark:font-bold drop-shadow-lg">
			<span class="text-xs w-fit whitespace-nowrap" :innerHTML="globalStore.tooltip.content"></span>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { globalStore } from "@/main.js";

const mouseX = ref(0);
const mouseY = ref(0);
let tooltipWidth = 100; // Adjust as needed
let tooltipHeight = 30; // Adjust as needed

const handleMouseMove = (event) => {
	mouseX.value = event.clientX;
	mouseY.value = event.clientY;

	const tooltipElement = document.getElementById("tooltip");
	if (tooltipElement) {
		tooltipWidth = tooltipElement.clientWidth;
		tooltipHeight = tooltipElement.clientHeight;

        let alignX = 0;
        let alignY = 0;
        switch (globalStore.tooltip.type) {
            case "top":
                alignX = 0;
                alignY = -tooltipHeight / 2 - 8;
                break;
            case "left":
                alignX = -tooltipWidth / 2 - 8;
                alignY = 0;
                break;
            case "right":
                alignX = tooltipWidth / 2 + 8;
                alignY = 0;
                break;
            case "bottom":
                alignX = 0;
                alignY = tooltipHeight / 2 + 8;
                break;
        }

        leftPosition.value = Math.min(window.innerWidth - tooltipWidth / 2 - 8, Math.max(mouseX.value + globalStore.tooltip.offsetx + alignX, tooltipWidth / 2 + 8));
		topPosition.value = Math.min(window.innerHeight - tooltipHeight - 8, Math.max(mouseY.value + globalStore.tooltip.offsety - tooltipHeight / 2  + alignY, 8));
	}
};

const leftPosition = ref(0);
const topPosition = ref(0);

onMounted(() => {
	window.addEventListener("mousemove", handleMouseMove);
});

onBeforeUnmount(() => {
	window.removeEventListener("mousemove", handleMouseMove);
});
</script>

<style scoped>
</style>
