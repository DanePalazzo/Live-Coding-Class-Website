/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      '10vh': '10vh',
      '20vh': '20vh',
      '80vh': '80vh',
      '90vh': '90vh',
    },
  },
  plugins: [require("daisyui")],
}