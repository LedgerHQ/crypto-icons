import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import lumen from '@ledgerhq/lumen-lint-plugin/eslint';
import importPlugin from 'eslint-plugin-import';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

const sourceFiles = ['src/**/*.{ts,tsx}'];
// Stories are the only files using Tailwind classes, so they get the Lumen preset only.
const storyFiles = ['__stories__/**/*.tsx'];

export default defineConfig(
  globalIgnores(['node_modules/', 'dist/']),
  {
    files: sourceFiles,
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      react.configs.flat.recommended,
      reactHooks.configs['recommended-latest'],
      importPlugin.flatConfigs.errors,
      importPlugin.flatConfigs.warnings,
      importPlugin.flatConfigs.typescript,
      prettierRecommended,
    ],
    rules: {
      'prettier/prettier': 'warn',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
      'import/no-named-as-default': 0,
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'import/order': [
        'warn',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
        },
      ],
    },
    settings: {
      react: { version: 'detect' },
      'import/resolver': {
        typescript: { alwaysTryTypes: true, project: './tsconfig.json' },
      },
      'import/ignore': ['react-native'],
    },
  },
  {
    ...lumen.configs.recommended,
    files: [...sourceFiles, ...storyFiles],
    languageOptions: { parser: tseslint.parser },
    settings: { 'better-tailwindcss': { entryPoint: 'src/styles.css' } },
  },
);
