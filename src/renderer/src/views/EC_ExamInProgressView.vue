<script setup>
import ART from "@/assets/ART.png"
</script>
<template>
    <div class="flex-col-center-full py-32 !font-bold" style="background-image: url();"> 
        <canvas class="fixed tl-0">
        </canvas>
        <div class="text-4xl mb-8 bg- text-neutral-100 z-10 bg-neutral-950/80 rounded-2xl px-8 py-4">U tijeku je pisanje ispita...</div>
        <div class="text-2xl mb-20 text-neutral-400 z-10 bg-neutral-950/60 rounded-xl px-6 py-3">Molimo da budete tihi :]</div>
        <img :src="ART" class="rounded-[25%] drop-shadow grow h-64 z-10 bg-neutral-100/10 p-6">
    </div>
</template>

<script>
export default {
    mounted() {
        // Initialising the canvas
        var canvas = document.querySelector('canvas'),
            ctx = canvas.getContext('2d');

        // Setting the width and height of the canvas
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Setting up the letters
        var letters = 'ABCDEFGHIJKLMNOPQRSTUVXYZ123456789!"#$%&/()=?*~ˇ^˘^°^˘˛°˛`GHIJKLMNOPQRSTUVXYZ12345678`˙´˙`˝´˙˝¨¸€|]]łłŁ}{@@@}"123456789!"#$%&/()=?*~ˇ^˘^°^˘˛°˛';
        letters = letters.split('');

        // Setting up the columns
        var fontSize = 10,
            columns = canvas.width / fontSize;

        // Setting up the drops
        var drops = [];
        for (var i = 0; i < columns; i++) {
            drops[i] = 1;
        }

        // Setting up the draw function
        function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, .15)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            for (var i = 0; i < drops.length; i++) {
                    var text = letters[Math.floor(Math.random() * letters.length)];
                    ctx.fillStyle = "rgba(255, 255, 255, .15)";
                    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                    drops[i]++;
                    if (drops[i] * fontSize > canvas.height && Math.random() > .95) {
                        drops[i] = 0;
                    }
                }
        }

        // Loop the animation
        setInterval(draw, 44);
    }
}
</script>

<style scoped>
canvas {display: block;}
</style>