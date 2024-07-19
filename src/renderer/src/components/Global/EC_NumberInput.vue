<template>
    <div class="relative">
        <input :value="modelValue" @input="$emit('update:modelValue', $event.target.value < 0 ? 0 : Number($event.target.value))" type="number"
            class="block rounded-md border-0 py-1.5 pl-3 bg-gray-50 dark:bg-neutral-800 text-gray-900 wh-full
            dark:text-neutral-400 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-neutral-700 outline-none
            placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6" />
        <div class="absolute tr-0 h-full items-end pr-2 justify-center flex flex-col gap-1">
            <i class="fa-solid fa-caret-up dark:text-neutral-400 text-neutral-800 -mb-1
                dark:hover:text-sky-500 hover:text-sky-600 cursor-pointer"
                @mousedown="updateValue(true)"
                @mouseleave="exit = true;"
                @mouseout="exit = true;"
                @mouseup="exit = true;">
            </i>
            <i class="fa-solid fa-caret-down dark:text-neutral-400 text-neutral-800 -mt-1
                dark:hover:text-sky-500 hover:text-sky-600 cursor-pointer" 
                @mousedown="updateValue(false)"
                @mouseleave="exit = true;"
                @mouseout="exit = true;"
                @mouseup="exit = true;">
            </i>
        </div>
    </div>    
</template>

<script>
import { wait } from "@/scripts/helpers.js";
export default {
	props: {
		modelValue: {
			type: [String, Number],
			default: "",
		},
        min: {
			type: Number,
			default: null,
		},
        max: {
			type: Number,
			default: null,
		},
	},
    data() { return { interval: null, exit: true, speed: 200 } }, 
    methods: {
        async loopDelay() {
            let i = 2;
            while (i > 0) {
                if (this.exit) return;
                await wait(0.1); 
                i--;
            }  
        }, 
        async loopSpeedIncrease() {
            while (!this.exit && this.speed > 1) {
                this.speed = this.speed-25;
                await wait(0.25); 
            }  
        },
        async updateValue(increase) {
            this.speed = 150;
            this.exit = false;
            if (increase) this.$emit('update:modelValue', this.modelValue >= this.max && this.max != null ? this.modelValue : this.modelValue+1);
            else this.$emit('update:modelValue', this.modelValue <= this.min && this.min != null ? this.modelValue : this.modelValue-1);
            await this.loopDelay();
            if (increase) this.increase();
            else this.decrease();
            await this.loopSpeedIncrease();
            this.speed = 1;
        },
        async increase() {
            while (!this.exit) {
                this.$emit('update:modelValue', this.modelValue >= this.max && this.max != null ? this.modelValue : this.modelValue+1);
                await wait(this.speed/1000);
            }
        },
        async decrease() {
            while (!this.exit) {
                this.$emit('update:modelValue', this.modelValue <= this.min && this.min != null ? this.modelValue : this.modelValue-1);
                await wait(this.speed/1000);
            }
        },
    }
};
</script>

<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
  appearance: textfield;
}
</style>
