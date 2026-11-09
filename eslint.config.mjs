import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginCypress from 'eslint-plugin-cypress';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: ['node_modules/', 'cypress/reports/', 'cypress/screenshots/', 'cypress/videos/'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['cypress/**/*.ts'],
    ...pluginCypress.configs.recommended,
    rules: {
      ...pluginCypress.configs.recommended.rules,
      // Enforce the "no fixed waits" rule of this project.
      'cypress/no-unnecessary-waiting': 'error',
      'cypress/no-force': 'error',
      'cypress/no-pause': 'error',
      'cypress/unsafe-to-chain-command': 'error',
    },
  },
  {
    files: ['scripts/**/*.mjs', '*.config.{ts,mjs}'],
    languageOptions: { globals: globals.node },
  },
  {
    rules: {
      '@typescript-eslint/no-namespace': ['error', { allowDeclarations: true }],
    },
  },
  prettierConfig,
);
