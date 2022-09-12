const colors = require('tailwindcss/colors')
const plugin = require('tailwindcss/plugin')

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
        'primary': {
          '50': '#f3f0ff',
          '100': '#e5deff',
          '200': '#cbbcff',
          '300': '#b09aff',
          '400': '#8a76ff',
          '500': '#644dff',
          '600': '#4d3cdd',
          '700': '#362bad',
          '800': '#20197d',
          '900': '#0d0a4d',
        },
        //'primary': colors.blue,
        'page-bg-light': colors.white,
        'page-bg-dark': colors.slate[900],
      },
    },
  },
  plugins: [
    plugin(({ addVariant, e }) => {
      addVariant('trix-active', '&.trix-active')
    }),
  ],
}
