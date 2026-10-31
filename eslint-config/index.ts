import { baseConfig } from './baseConfig.ts';
import {
  isomorphicLanguageOptionsConfigs,
  nodeLanguageOptionsConfigs,
} from './languagesOptionsConfigs.ts';
import { tsConfigs } from './tsConfig.ts';

/** facade for exporting eslint config  */
export const eslintConfig = {
  base: baseConfig,
  ts: tsConfigs,
  languageOptions: {
    isomorphic: isomorphicLanguageOptionsConfigs,
    node: nodeLanguageOptionsConfigs,
  },
};
