/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      zIndex: {
        1000: '1000'
      }
    }
  },
  daisyui: {
    themes: [
      {
        draculaLight: {
          primary: '#3b82f6',

          secondary: '#bf95f9',

          accent: '#ffb86b',

          neutral: '#414558',

          'base-100': '#1f2937',

          info: '#8be8fd',

          success: '#52fa7c',

          warning: '#f1fa89',

          error: '#ff5757'
        }
      }
    ]
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('daisyui'),
    ({ addUtilities }) => {
      const newUtilities = {
        '.dragNDrop': {
          outline: '2px dashed lightblue'
        }
      }
      addUtilities(newUtilities)
    }
  ]
}
