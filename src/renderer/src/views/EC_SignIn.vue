<script setup>
import { userStore } from "@/main.js";
userStore.signIn();
</script>
<template>
    <div class="flex-center-full">
        <EC_ButtonGoogle @click="userStore.signIn();"/>
    </div>
</template>