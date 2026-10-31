import { configs, type FlatConfig } from 'typescript-eslint';

export const tsConfigs: FlatConfig.ConfigArray = [
  ...configs.recommendedTypeChecked,
  // Ignore unused vars, args, and caught errors prefixed with `_`.
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
];
