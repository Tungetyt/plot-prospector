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
    themes: ['nord', 'dim']
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('daisyui'),
    ({addUtilities}) => {
      addUtilities({
        '.drag-n-drop': {
          outline: '2px dashed lightblue'
        },
        '.aspect-ratio-1': {
          aspectRatio: '1'
        },
        '.scrollbar-gutter-stable': {
          scrollbarGutter: 'stable'
        }
      })
    },
    ({addComponents}) => {
      addComponents({
        '.highlight::after': {
          content: '""',
          position: 'absolute',
          inset: 0,
          'pointer-events': 'none',
          'box-shadow': 'inset 0 0 30px 0 rgba(0, 0, 255, 1)',
          'z-index': '99999' // Adjust as needed
        }
      })
    }
  ]
}
