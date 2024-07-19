/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
      extend: {},
  },
  plugins: [
    require("@headlessui/tailwindcss")({ prefix: "ui" }),
    require("tailwind-scrollbar")({ nocompatible: true }),
    require('postcss-nested'),
    require('autoprefixer'),
  ],
}

