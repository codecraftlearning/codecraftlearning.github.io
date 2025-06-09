/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2E2E2E',
        secondary: '#F0EBE3',
        accent: '#FFB84C',
        highlight: '#ACFF6C',
        background: '#FFFFFF',
        text: '#333333',
        info: '#F3FCFF',
        warnLight: '#FFD7D7',
        opportunityLight: '#FFEE91',
        opportunityDark: '#FFD700',
      },
      width: {
        '75vw': '75vw',
        '60vw': '60vw',
      },
      fontFamily:{
        outfit: ['Outfit', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif']
      },
      screens: {
        'xs': '350px', // custom breakpoint named 'xs'
      },
    },
  },
  plugins: [],
}

