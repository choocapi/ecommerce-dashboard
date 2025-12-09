import js from '@eslint/js';
import queryPlugin from '@tanstack/eslint-plugin-query';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettierConfig from 'eslint-config-prettier';
import prettier from 'eslint-plugin-prettier';
import globals from 'globals';

/** @type {import('eslint').Linter.Config[]} */
const config = [
  {
    ignores: [
      'node_modules/**',
      'build/**',
      'vendor/**',
      'public/**',
      'bootstrap/ssr/**',
      '.next/**',
      'out/**',
      'next-env.d.ts',
      'tailwind.config.js',
      'coverage/**',
      '*.min.js',
    ],
  },
  js.configs.recommended,
  ...nextVitals,
  ...nextTs,

  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/no-unescaped-entities': 'off',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-explicit-any': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },

  {
    plugins: {
      prettier,
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },

  {
    plugins: {
      '@tanstack/query': queryPlugin,
    },
    rules: {
      '@tanstack/query/exhaustive-deps': 'error',
      '@tanstack/query/no-rest-destructuring': 'warn',
      '@tanstack/query/stable-query-client': 'error',
    },
  },

  {
    rules: {
      indent: ['error', 2, { SwitchCase: 1 }],
      'no-trailing-spaces': 'error',
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
      'no-tabs': 'error',
      'no-mixed-spaces-and-tabs': 'error',
      'padded-blocks': ['error', 'never'],
      'spaced-comment': ['error', 'always', { exceptions: ['-', '+'] }],
    },
  },

  prettierConfig,
];

export default config;
