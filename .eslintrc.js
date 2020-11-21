module.exports = {
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  env: {
    browser: true,
    es2020: true,
    node: true,
    jest: true,
  },
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['react'],
  ignorePatterns: ['build/', 'node_modules/'],
  root: true,
  rules: {
    'indent': ['error', 2],
    'keyword-spacing': 2,
    'no-unused-vars': 'warn',
    'quote-props': ['error', 'consistent-as-needed'],
    'semi': 'warn',
    'no-undef': 'error',
    'no-global-assign': 'error',
    'quotes': ['warn', 'single', { avoidEscape: true }],
    'comma-dangle': ['error', 'only-multiline'],
    'eqeqeq': ['error', 'always'],
    'no-unused-expressions': [
      'warn',
      {
        allowTaggedTemplates: true,
        allowTernary: true,
        allowShortCircuit: true,
      },
    ],
    'no-console': 0,
    'react/prop-types': 0,
  },
};
