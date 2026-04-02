/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
    './client/index.html',
    './client/src/**/*.{js,jsx}',
  ],
  darkMode: 'class',
  safelist: [
    // Benner stage colors used dynamically
    { pattern: /bg-(purple|indigo|blue|sky|cyan)-(100|600|900)/, variants: ['dark'] },
    { pattern: /text-(purple|indigo|blue|sky|cyan)-(400|600)/, variants: ['dark'] },
    // Category colors used dynamically
    { pattern: /bg-(rose|emerald|amber)-(100|500|600)/ },
    { pattern: /text-(rose|emerald|amber)-(600|700)/ },
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd',
          400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8',
          800: '#1e40af', 900: '#1e3a8a', 950: '#172554'
        },
        benner: {
          novice: '#8b5cf6',
          advanced: '#6366f1',
          competent: '#3b82f6',
          proficient: '#0ea5e9',
          expert: '#06b6d4'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif']
      }
    }
  },
  plugins: []
};
