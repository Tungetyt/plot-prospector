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
        '.dragNDrop': {
          outline: '2px dashed lightblue'
        },
        '.plotImg': {
          aspectRatio: '1'
        },
        '.plotForm': {
          scrollbarGutter: 'stable'
        }
      })
    },
    ({addComponents}) => {
      addComponents({
        '.highlight::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          'pointer-events': 'none',
          'box-shadow': 'inset 0 0 30px 0 rgba(0, 0, 255, 1)',
          'z-index': '99999' // Adjust as needed
        }
      })
    }
  ]
}
