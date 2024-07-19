<script setup>
import { globalStore, fileStore } from "@/main.js";
</script>

<template>
    <div v-if="globalStore.storeSelected == 'fileStore'" class="flex flex-col gap-0.5 text-sm"> 
        <EC_Button class="w-48" bg="red" @click="fileStore.RESET_TO_DEFAULT_VALUES()"> RESET_TO_DEFAULT_VALUES </EC_Button>
        <div class="flex items-center gap-2">
            <EC_Input class="w-48 h-5 rounded" v-model="fileStore.selectedScript" />
            selectedScript
        </div>        
        <div class="flex items-center gap-2">
            <EC_NumberInput class="w-48 h-5 rounded" v-model="fileStore.groupIndex" />
            groupIndex
        </div>
        <div class="flex items-center gap-2">
            <EC_NumberInput class="w-48 h-5 rounded" v-model="fileStore.taskIndex" />
            taskIndex
        </div>
        <div class="flex items-center gap-2">
            <EC_NumberInput class="w-48 h-5 rounded" v-model="fileStore.passwordLength" />
            passwordLength
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