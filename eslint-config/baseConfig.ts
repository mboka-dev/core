import js from '@eslint/js';
import type { FlatConfig } from 'typescript-eslint';
import { globalIgnores } from 'eslint/config';

/** Base Linting Config */
export const baseConfig: FlatConfig.ConfigArray = [
  globalIgnores([
    '**/dist/',
    '**/node_modules/',
    'fixtures/',
    'data/',
    'packages/py/',
    'packages/js/src/generated/',
  ]),
  js.configs.recommended,
  {
    rules: {
      'no-irregular-whitespace': [
        'error',
        {
          skipStrings: true,
          skipTemplates: true,
        },
      ],
    },
  },
];
