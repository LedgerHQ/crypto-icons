import type { StorybookConfig } from '@storybook/react-webpack5';

const config: StorybookConfig = {
  stories: ['../__stories__/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-webpack5-compiler-swc', '@storybook/addon-controls'],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
};
export default config;
