<script setup>
import { examStore, globalStore } from "@/main.js";
</script>

<template>
	<div class="wh-full flex flex-col bg-neutral-200 dark:bg-neutral-950 text-neutral-400">
        <iframe v-if="globalStore.windowsHidden['PREVIEW']" class="opacity-0 pointer-events-none fixed"></iframe>
        <EC_WindowsSettings/>
        <div class="wh-full flex flex-col overflow-hidden">
            <div class="flex h-full w-full">
                <EC_SideBarSolutions />
                <div class="flex h-full w-full overflow-y-auto overflow-x-hidden">
                    <EC_Editor />
                </div>
            </div>
        </div>
	</div>
</template>