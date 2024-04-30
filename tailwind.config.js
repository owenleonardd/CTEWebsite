/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/*.{html,js}"],
  theme: {
    extend: {
      transitionProperty: {
        'height': 'height', // Define transition for height property
      },
      transitionDuration: {
        '300': '300ms', // Define transition duration
      },
      transitionTimingFunction: {
        'ease-in-out': 'ease-in-out', // Define transition timing function
      },
    },
  },
  plugins: [],
}