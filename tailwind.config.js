/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'bg-indigo-500', 'bg-indigo-600', 'hover:bg-indigo-700', 'focus:ring-indigo-500', 'ring-indigo-500', 'disabled:bg-indigo-800', 'dark:disabled:bg-indigo-900', 'text-indigo-400', 'text-indigo-500', 'hover:shadow-indigo-500/50',
    'bg-blue-500', 'bg-blue-600', 'hover:bg-blue-700', 'focus:ring-blue-500', 'ring-blue-500', 'disabled:bg-blue-800', 'dark:disabled:bg-blue-900', 'text-blue-400', 'text-blue-500', 'hover:shadow-blue-500/50',
    'bg-green-500', 'bg-green-600', 'hover:bg-green-700', 'focus:ring-green-500', 'ring-green-500', 'disabled:bg-green-800', 'dark:disabled:bg-green-900', 'text-green-400', 'text-green-500', 'hover:shadow-green-500/50',
    'bg-orange-500', 'bg-orange-600', 'hover:bg-orange-700', 'focus:ring-orange-500', 'ring-orange-500', 'disabled:bg-orange-800', 'dark:disabled:bg-orange-900', 'text-orange-400', 'text-orange-500', 'hover:shadow-orange-500/50',
    'bg-rose-500', 'bg-rose-600', 'hover:bg-rose-700', 'focus:ring-rose-500', 'ring-rose-500', 'disabled:bg-rose-800', 'dark:disabled:bg-rose-900', 'text-rose-400', 'text-rose-500', 'hover:shadow-rose-500/50',
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
}
