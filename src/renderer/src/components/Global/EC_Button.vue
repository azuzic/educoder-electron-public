<template>
    <button class="text-xs rounded px-2 py-0.5 active:scale-90 disabled:active:scale-100 disabled:cursor-not-allowed"
        :class="bg == '' ? 
        'dark:text-neutral-300 text-neutral-600 dark:bg-neutral-700 bg-neutral-300 hover:brightness-105'
        :bg == 'blue' ? 'text-slate-200 bg-sky-600 hover:bg-sky-500 dark:bg-sky-800 dark:hover:bg-sky-700' :
        bg == 'yellow' ? 'text-amber-50 bg-yellow-700 hover:bg-amber-600' :
        bg == 'red' ? 'text-rose-200 bg-rose-700 hover:bg-rose-600' :
        bg == 'green' ? 'text-slate-200 bg-green-700 hover:bg-green-600 dark:bg-green-800 dark:hover:bg-green-700' : bg">
        <slot></slot>
    </button>
</template>
<script>
export default { props: { bg: { typeof: String, default: '' } } }
</script>