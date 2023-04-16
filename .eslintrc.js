module.exports = {
  extends: [
    'airbnb',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
    'prettier',
  ],
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  env: {
    browser: true,
    es6: true,
  },
  plugins: [
    'react',
    'react-hooks',
    'simple-import-sort',
    'import',
    'prettier',
  ],
  settings: {
    react: { version: 'detect' },
  },
  rules: {
    'prettier/prettier': [
      1,
      {
        trailingComma: 'es5',
        singleQuote: true,
      },
    ],
    'consistent-return': 'off',
    'no-plusplus': 'off',
    'prefer-promise-reject-errors': 'off',
    'no-param-reassign': 'off',
    'no-shadow': 'off',
    'no-bitwise': 'off',
    'import/prefer-default-export': 'off',
    'import/order': ['off', { 'newlines-between': 'always' }],
    'import/no-unresolved': 'off',
    'import/extensions': 'off',
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          [
            '^react',
            '^@?\\w',
            '^~/lib(/.*|$)',
            '^~/components(/.*|$)',
            '^\\.\\.(?!/?$)',
            '^\\.\\./?$',
            '^\\./(?=.*/)(?!/?$)',
            '^\\.(?!/?$)',
            '^\\./?$',
          ],
        ],
      },
    ],
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'react/require-default-props': 'off',
    'react/jsx-filename-extension': [1, { extensions: ['.jsx', '.tsx'] }],
    'react/jsx-props-no-spreading': 'off',
    'react/no-children-prop': 'off',
  },
  overrides: [],
};
