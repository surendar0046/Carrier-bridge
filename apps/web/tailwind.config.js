/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      fontSize: {
        '2xs': '0.75rem',
        xs: '0.8125rem',
        sm: '0.9375rem',
        base: '1.0625rem',
        lg: '1.1875rem',
        xl: '1.3125rem',
        '2xl': '1.625rem',
        '3xl': '2rem',
        '4xl': '2.25rem',
        '5xl': '2.75rem',
        '6xl': '3.25rem',
      },
      colors: {
        brand: { primary: '#3b82f6', secondary: '#8b5cf6', accent: '#f97316' },
      },
    },
  },
  plugins: [],
};
