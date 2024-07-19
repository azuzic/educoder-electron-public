<script setup>
import { globalStore, userStore } from "@/main.js";
</script>

<template>
    <div v-if="globalStore.storeSelected == 'userStore'" class="flex flex-col gap-0.5 text-sm"> 
        <div class="flex items-center gap-2">
            <EC_Input class="w-48 h-5 rounded" v-model="userStore.user.email" />
            user.email
        </div>
        <div class="flex items-center gap-2">
            <EC_Input class="w-48 h-5 rounded" v-model="userStore.user.displayName" />
            user.displayName
        </div>
        <EC_CheckBox v-model="userStore.introductionDialogRead" label="introductionDialogRead" /> 
        <div class="flex flex-col w-fit gap-0.5 mt-1 bg-black dark:bg-white bg-opacity-10 dark:bg-opacity-10 p-1 rounded">
            <EC_Button class="w-48" bg="green" @click="userStore.signIn()"> signIn </EC_Button>
        </div>
        <div class="flex flex-col w-fit gap-0.5 mt-1 bg-black dark:bg-white bg-opacity-10 dark:bg-opacity-10 p-1 rounded">
            <EC_Button class="w-48" bg="red" @click="userStore.handleSignOut()"> handleSignOut </EC_Button>
        </div>
    </div>
</template> 
<script>
export default {
    data() {
        return {
             email: '',
             exists: false,
        }
    }
}
</script>