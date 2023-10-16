/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      zIndex: {
        1000: '1000',
      },
    },
  },
  daisyui: {
    themes: ['lemonade'],
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
}
