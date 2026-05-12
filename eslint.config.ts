import {defineConfig} from 'eslint/config';
import shopifyPlugin from '@shopify/eslint-plugin';

export default defineConfig([
  ...shopifyPlugin.configs.typescript,
  ...shopifyPlugin.configs.prettier,
  {
    ignores: [
      '**/build/',
      '**/tmp/',
      '**/dist/',
      '**/coverage/',
      '**/node_modules/',
      '**/vite.config.ts',
      '**/vite.config.*.ts',
      '**/.eslintrc.cjs',
      '**/*.mjs',
      'docs/**/*.json',
      '**/*.example.ts',
      '**/*.example.tsx',
      '**/*.example.*.ts',
      '**/*.example.*.tsx',
    ],
  },
  {
    rules: {
      'import/no-extraneous-dependencies': 'off',
      'no-console': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/consistent-indexed-object-style': 'off',
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-empty-object-type': [
        'error',
        {allowInterfaces: 'with-single-extends'},
      ],
    },
  },
  {
    files: ['**/*.d.ts'],
    rules: {
      '@shopify/prefer-module-scope-constants': 'off',
    },
  },
  {
    files: ['src/react/**/*.ts', 'src/react/**/*.tsx'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../server/*'],
              message:
                'Importing from src/server in src/react is not allowed because it breaks bundling boundaries.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/server/**/*.ts', 'src/server/**/*.tsx'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../react/*'],
              message:
                'Importing from src/react in src/server is not allowed because it breaks bundling boundaries.',
            },
          ],
        },
      ],
    },
  },
]);
