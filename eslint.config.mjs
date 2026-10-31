import { defineConfig } from 'eslint/config';
import { eslintConfig } from './eslint-config/index.ts';

/** Workspaces that are linted by this root config. Each gets the shared rule */
const srcFiles = ['packages/js/src/**/*.ts'];
const toolsFiles = ['scripts/**/*.mjs', 'packages/js/test/**/*.mjs'];
const configFiles = ['eslint.config.ts', 'eslint-config/**/*.ts'];

export default defineConfig([
  eslintConfig.base,
  {
    files: srcFiles,
    extends: [eslintConfig.ts, eslintConfig.languageOptions.isomorphic],
  },
  {
    // Scripts & Tests
    files: toolsFiles,
    extends: [eslintConfig.languageOptions.node],
  },
  {
    // Configuration files
    files: configFiles,
    extends: [eslintConfig.ts, eslintConfig.languageOptions.node],
    languageOptions: {
      parserOptions: {
        // Resolve tsconfig files from the repository root.
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
]);
