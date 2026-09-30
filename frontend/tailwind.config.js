/** @type {import('tailwindcss').Config} */
const token = (name) => `rgb(var(--c-${name}) / <alpha-value>)`;

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  // Light/dark follows the system setting (prefers-color-scheme) via CSS variables.
  darkMode: 'media',
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system', 'BlinkMacSystemFont', '"SF Pro Text"', '"Segoe UI Variable"',
          '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif',
        ],
      },
      colors: {
        canvas: token('canvas'),
        surface: token('surface'),
        fill: token('fill'),
        ink: token('ink'),
        'ink-2': token('ink-2'),
        'ink-3': token('ink-3'),
        line: token('line'),
        accent: token('accent'),
        'accent-fill': token('accent-fill'),
        ok: token('ok'),
        warn: token('warn'),
        bad: token('bad'),
      },
      borderRadius: { card: '16px' },
    },
  },
  plugins: [],
};
