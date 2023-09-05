module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    'postcss-import': {},
    'postcss-flexbugs-fixes': {},
    // Firefox does not support :has() pseudo-class
    'css-has-pseudo': {},
    'postcss-preset-env': {
      autoprefixer: {
        flexbox: 'no-2009',
      },
      stage: 3,
    },
  },
};
