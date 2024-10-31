import type { StorybookConfig } from '@storybook/react-webpack5';
import { dirname, join } from 'path';

function getAbsolutePath(value: string): string {
  return dirname(require.resolve(join(value, 'package.json')));
}

const config: StorybookConfig = {
  stories: ['../__stories__/**/*.native.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-react-native-web'],
  framework: {
    name: getAbsolutePath('@storybook/react-webpack5'),
    options: {},
  },
  webpackFinal: async (config) => {
    if (config?.resolve) {
      config.resolve.alias = {
        ...(config?.resolve?.alias || {}),
      };
    }

    if (config?.resolve) {
      config.resolve.extensions = ['.ts', '.tsx'];
    }

    return config;
  },
};

export default config;
