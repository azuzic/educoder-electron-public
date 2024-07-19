<template>
	<textarea :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
    class="w-full p-3 bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700
        rounded-md focus:ring-1 ring-gray-300 dark:ring-neutral-700 text-gray-900 dark:text-neutral-400 placeholder:text-gray-400
        dark:placeholder:text-neutral-500 outline-none" />
</template>

<script>
export default {
	props: {
		modelValue: {
			type: String,
			default: "",
		},
	},
};
</script>
