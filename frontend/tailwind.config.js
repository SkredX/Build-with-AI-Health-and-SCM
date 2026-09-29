/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        govNavy: '#0b132b',
        govCard: '#1c2541',
        govBorder: '#2a3b5c',
        govAccent: '#00b4d8',
        clinicalEmerald: '#10b981',
        alertRed: '#ef4444',
        warningAmber: '#f59e0b',
      },
    },
  },
  plugins: [],
};
