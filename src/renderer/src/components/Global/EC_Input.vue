<template>
	<input :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
    class="block rounded-md border-0 py-1.5 pl-3 bg-gray-50 dark:bg-neutral-800 text-gray-900
        dark:text-neutral-400 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-neutral-700 outline-none
        placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6" />
</template>

<script>
export default {
	props: {
		modelValue: {
			type: [String, Number],
			default: "",
		},
	},
};
</script>
