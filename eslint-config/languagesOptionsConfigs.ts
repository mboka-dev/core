import globals from 'globals';
import type { FlatConfig } from 'typescript-eslint';

/** Linting config for isomorphic (browser and Node.js) environments */
export const isomorphicLanguageOptionsConfigs: FlatConfig.ConfigArray = [
  {
    languageOptions: {
      // Same as the ones we use in our `tsconfig compilerOptions.lib` for browser
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.es2022,
      },
      parserOptions: {
        projectService: true,
      },
    },
  },
];

/** Linting congif for scripts and tests: Node.js environments */
export const nodeLanguageOptionsConfigs: FlatConfig.ConfigArray = [
  {
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2023,
      },
      parserOptions: {
        projectService: true,
      },
    },
  },
];
