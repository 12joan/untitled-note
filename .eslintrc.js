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
      'error',
      {
        trailingComma: 'es5',
        singleQuote: true,
      },
    ],
    'consistent-return': 'off',
    'prefer-promise-reject-errors': 'off',
    'default-case': 'off',
    'no-plusplus': 'off',
    'no-param-reassign': 'off',
    'no-shadow': 'off',
    'no-bitwise': 'off',
    'no-use-before-define': 'off',
    'no-underscore-dangle': 'off',
    'no-case-declarations': 'off',
    'no-restricted-syntax': 'off',
    'no-await-in-loop': 'off',
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
    '@typescript-eslint/no-non-null-assertion': 'off',
    'react/require-default-props': 'off',
    'react/jsx-filename-extension': ['error', { extensions: ['.jsx', '.tsx'] }],
    'react/jsx-props-no-spreading': 'off',
    'react/no-children-prop': 'off',
    'react/function-component-definition': 'off',
    'react/no-unstable-nested-components': 'off',
    'react/prop-types': 'off',
    'react/jsx-no-useless-fragment': ['error', { allowExpressions: true }],
    'jsx-a11y/no-noninteractive-tabindex': 'off',
    'jsx-a11y/anchor-has-content': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/label-has-associated-control': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
  },
  overrides: [
    {
      files: [
        // Only direct children of lib and components
        'client/{lib,components}/*.{ts,tsx}',
      ],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['.*'],
                message: 'Relative imports are not allowed.',
              },
            ],
          },
        ],
      },
    }
  ],
};
