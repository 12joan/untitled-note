const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');
const plugin = require('tailwindcss/plugin');
const lineClamp = require('@tailwindcss/line-clamp');
const typography = require('@tailwindcss/typography');

module.exports = {
  content: ['./client/**/*.{js,ts,jsx,tsx,html}', './app/views/**/*.html.erb'],
  theme: {
    extend: {
      zIndex: {
        5: '5',
      },

      boxShadow: {
        dialog:
          '0 0.75rem 2rem rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.05) 0px 0px 0px 1px',
        'dialog-heavy':
          '0 0.75rem 2rem rgba(0, 0, 0, 0.20), rgba(0, 0, 0, 0.05) 0px 0px 0px 1px',
      },
      colors: {
        primary: {
          50: '#f3f0ff',
          100: '#e5deff',
          200: '#cbbcff',
          300: '#b09aff',
          400: '#8a76ff',
          500: '#644dff',
          600: '#4d3cdd',
          700: '#362bad',
          800: '#20197d',
          900: '#0d0a4d',
        },
        slate: {
          850: '#162032',
        },
        'page-bg-light': colors.white,
        'page-bg-dark': colors.slate[900],
      },
      animation: {
        grow: 'grow 1s ease-in-out infinite',
      },
      keyframes: {
        grow: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.25)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      ringOffsetColor: {
        DEFAULT: 'inherit',
      },
    },
    screens: {
      '4xs': '128px',
      '3xs': '256px',
      '2xs': '384px',
      xs: '512px',
      ...defaultTheme.screens,
    },
  },
  plugins: [
    lineClamp,
    typography,
    plugin(({ addVariant }) => {
      addVariant('window-inactive', 'body.inactive &');
      addVariant('hocus', ['&:hover', '&:focus-visible']);
      addVariant('group-hocus', ['.group:hover &', '.group:focus-visible &']);
      addVariant('group-focus-visible', ['.group:focus-visible &']);
      addVariant(
        'group-focus-visible-within',
        '.group:has(:focus-visible) &'
      );
      addVariant(
        'stretch-focus-visible',
        '&:has(.stretch-target:focus-visible)'
      );
      addVariant('stretch-hover', '&:has(.stretch-target:hover)');
      addVariant('children', '& > *');
      ['data-active', 'data-drag-over'].forEach((dataAttribute) => {
        const selector = `[${dataAttribute}=true]`;
        addVariant(dataAttribute, [`&${selector}`, `${selector} &`]);
      });
    }),
  ],
};
