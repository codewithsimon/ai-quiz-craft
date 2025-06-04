/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        blue: {
          50: '#eef4ff',
          100: '#d9e5ff',
          200: '#bcd2ff',
          300: '#8eb6ff',
          400: '#5c91ff',
          500: '#3e63dd',
          600: '#2444cb',
          700: '#1e34a5',
          800: '#1d2e88',
          900: '#1d2c6d',
          950: '#14195a',
        },
        purple: {
          50: '#f6f4ff',
          100: '#ede9ff',
          200: '#dbd3ff',
          300: '#c0b0ff',
          400: '#a184ff',
          500: '#8e33d6',
          600: '#7823b6',
          700: '#681da0',
          800: '#551a84',
          900: '#46196d',
          950: '#2a0e49',
        },
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
};