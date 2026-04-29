/* eslint-disable @typescript-eslint/no-magic-numbers */
import js from '@eslint/js';
import love from 'eslint-config-love';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  js.configs.recommended,
  ...tseslint.configs.recommended,
  love,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      '@typescript-eslint/class-methods-use-this': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@eslint-community/eslint-comments/require-description': 'off',
    },
  },
  {
    files: ['jest.config.js'],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': [
        'error',
        {
          printWidth: 120,
          singleQuote: true,
          semi: true,
          trailingComma: 'all',
          bracketSpacing: true,
        },
      ],
    },
  },

  prettierConfig, // 👈 sempre por último
]);
