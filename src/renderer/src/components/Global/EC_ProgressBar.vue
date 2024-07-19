<template>
    <div class="bg-neutral-400 border border-neutral-900 ring-1 ring-neutral-100 w-full h-4 rounded-full relative overflow-hidden text-sm">
        <b class="absolute text-black translate-center">{{ current }}/{{ max }} - {{ getPercentage() }}%</b>
        <div class="h-full" :style="`width: ${getPercentage()}%; background-color: ${getColor(current / max)};`">

        </div>
    </div>
</template>
<script>
export default {
    props: {
        current: Number,
        max: Number
    },
    methods: {
        getPercentage() {
            return ((this.current/this.max)*100).toFixed(2)
        },
        getColor(value) {
            const red = [255, 0, 0];
            const orange = [255, 165, 0];
            const yellow = [255, 255, 0];
            const green = [50, 160, 50];
            const blue = [25, 75, 240];

            const interpolateColor = (start, end, percentage) => {
                const result = [];
                for (let i = 0; i < start.length; i++) {
                result.push(Math.round(start[i] + (end[i] - start[i]) * percentage));
                }
                return `rgb(${result.join(', ')})`;
            };

            if (value < 0.4) {
                return interpolateColor(red, orange, (value - 0.2) / 0.2);
            } else if (value < 0.6) {
                return interpolateColor(orange, yellow, (value - 0.4) / 0.2);
            } else if (value < 0.8) {
                return interpolateColor(yellow, green, (value - 0.6) / 0.2);
            } else {
                return interpolateColor(green, blue, (value - 0.8) / 0.2);
            } 
        }
    },
}
</script>