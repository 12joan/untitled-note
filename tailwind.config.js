const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');
const plugin = require('tailwindcss/plugin');

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
        plain: {
          50: 'rgb(var(--color-plain-50) / <alpha-value>)',
          100: 'rgb(var(--color-plain-100) / <alpha-value>)',
          200: 'rgb(var(--color-plain-200) / <alpha-value>)',
          300: 'rgb(var(--color-plain-300) / <alpha-value>)',
          400: 'rgb(var(--color-plain-400) / <alpha-value>)',
          500: 'rgb(var(--color-plain-500) / <alpha-value>)',
          600: 'rgb(var(--color-plain-600) / <alpha-value>)',
          700: 'rgb(var(--color-plain-700) / <alpha-value>)',
          800: 'rgb(var(--color-plain-800) / <alpha-value>)',
          850: 'rgb(var(--color-plain-850) / <alpha-value>)',
          900: 'rgb(var(--color-plain-900) / <alpha-value>)',
          950: 'rgb(var(--color-plain-950) / <alpha-value>)',
        },
        primary: {
          400: '#8a76ff',
          500: '#644dff',
        },
        'page-bg-light': colors.white,
        'page-bg-dark': 'rgb(var(--color-plain-900) / <alpha-value>)',
      },
      animation: {
        grow: 'grow 1s ease-in-out infinite',
        shake: 'shake 0.25s linear 2',
      },
      keyframes: {
        grow: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.25)' },
          '100%': { transform: 'scale(1)' },
        },
        shake: {
          '0%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(0.75rem)' },
          '50%': { transform: 'translateX(0)' },
          '75%': { transform: 'translateX(-0.75rem)' },
          '100%': { transform: 'translateX(0)' },
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
    plugin(({ addVariant }) => {
      addVariant('window-inactive', 'body.inactive &');

      addVariant('hocus', ['&:hover', '&:focus-visible']);

      addVariant('group-hocus', ['.group:hover &', '.group:focus-visible &']);
      addVariant('group-focus-visible', ['.group:focus-visible &']);

      addVariant(
        'stretch-focus-visible',
        '&:has(.stretch-target:focus-visible)'
      );

      addVariant(
        'group-stretch-focus-visible',
        '.group:has(.stretch-target:focus-visible) &'
      );

      addVariant('stretch-hover', '&:has(.stretch-target:hover)');

      addVariant('children', '& > *');

      ['data-active', 'data-drag-over'].forEach((dataAttribute) => {
        const selector = `[${dataAttribute}=true]`;
        addVariant(dataAttribute, [`&${selector}`, `${selector} &`]);
      });

      addVariant('slate-void', '& [data-slate-void]');
      addVariant('slate-string', ['& [data-slate-string]', '& [data-slate-zero-width]']);
      addVariant('slate-top-level', '[data-slate-editor] > &');

      addVariant('literary', '.style-literary &');

      // https://github.com/tailwindlabs/tailwindcss/discussions/3105#discussioncomment-248885
      addVariant('em', ({ container }) => {
        container.walkRules(rule => {
          rule.selector = `.em\\:${rule.selector.slice(1)}`;
          rule.walkDecls((decl) => {
            decl.value = decl.value.replace('rem', 'em');
          });
        });
      });
    }),
  ],
};
