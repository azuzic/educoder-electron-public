<template>
<div class="text-left">
    <h2 class="text-base font-semibold leading-7 text-gray-900 dark:text-neutral-300" v-html="title"></h2>
    <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-neutral-400" v-html="description"></p>
</div>
</template>
<script>
export default {
    props: { title: String, description: String }
}
</script>