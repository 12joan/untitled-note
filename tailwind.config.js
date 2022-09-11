const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/javascript/**/*.{js,ts,jsx,tsx}',
    './app/views/**/*.html.erb',
  ],
  theme: {
    extend: {
      boxShadow: {
        'dialog': '0 0.75rem 2rem rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.05) 0px 0px 0px 1px',
      },
      colors: {
        'page-bg-light': colors.white,
        'page-bg-dark': colors.slate[900],
      },
    },
  },
  plugins: [],
}
