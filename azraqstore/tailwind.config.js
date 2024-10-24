/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tomato: '#FF6347',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
}
