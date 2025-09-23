import type { StorybookConfig } from '@storybook/react-webpack5';
import path from 'path';

const config: StorybookConfig = {
  stories: ['../__stories__/CryptoIconList.stories.tsx'],
  addons: ['@storybook/addon-webpack5-compiler-swc', '@storybook/addon-controls'],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  staticDirs: [
    {
      from: path.resolve(__dirname, '../../assets'),
      to: '/assets',
    },
  ],
};
export default config;
