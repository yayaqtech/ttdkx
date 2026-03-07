// @ts-check
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginAstro from 'eslint-plugin-astro';
import globals from 'globals';

export default tseslint.config(
  // Base JS recommended rules
  js.configs.recommended,

  // TypeScript recommended rules
  ...tseslint.configs.recommended,

  // Astro recommended rules (handles .astro files)
  ...eslintPluginAstro.configs.recommended,

  // Global ignores
  {
    ignores: ['dist/**', '.astro/**', 'node_modules/**', 'public/**'],
  },

  // Node.js globals for config files
  {
    files: ['*.config.{js,mjs,cjs}', 'eslint.config.mjs'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  // Custom rule overrides
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  }
);
