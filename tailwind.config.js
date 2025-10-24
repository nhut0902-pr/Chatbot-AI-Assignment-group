/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'bg-indigo-600',
    'bg-blue-600',
    'bg-green-600',
    'bg-orange-600',
    'bg-rose-600',
    'bg-indigo-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-orange-500',
    'bg-rose-500',
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
}