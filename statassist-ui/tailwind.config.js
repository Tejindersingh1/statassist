/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1', // primary
          600: '#4f46e5', // hover
          700: '#4338ca',
        },
      },
      fontSize: {
        hero: ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }], // 40 px
      },
      borderRadius: { DEFAULT: '0.75rem' }, // cards 12 px
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

