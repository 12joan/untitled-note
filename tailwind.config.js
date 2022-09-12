const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')
const plugin = require('tailwindcss/plugin')
const lineClamp = require('@tailwindcss/line-clamp')

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
        'page-bg-light': colors.white,
        'page-bg-dark': colors.slate[900],
      },
    },
    screens: {
      '4xs': '128px',
      '3xs': '256px',
      '2xs': '384px',
      'xs': '512px',
      ...defaultTheme.screens,
    },
  },
  plugins: [
    lineClamp,
    plugin(({ addVariant, e }) => {
      addVariant('trix-active', '&.trix-active')
      addVariant('window-inactive', 'body.inactive &')
      addVariant('hocus', ['&:hover', '&:focus-visible'])
      addVariant('group-hocus', ['.group:hover &', '.group:focus-visible &'])
    }),
  ],
}
