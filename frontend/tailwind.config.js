/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
  colors: {
    primary: "#4f46e5",
    success: "#22c55e",
    danger: "#ef4444",
    warning: "#f59e0b",
    dark: "#0f172a"
  },
},
  },
  plugins: [],
}