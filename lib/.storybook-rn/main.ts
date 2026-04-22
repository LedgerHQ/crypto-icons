import path from 'path';
import type { StorybookConfig } from '@storybook/react-webpack5';

const config: StorybookConfig = {
  stories: [
    '../__stories__/**/*.rn.mdx',
    '../__stories__/**/*.rn.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: ['@storybook/addon-essentials', '@storybook/addon-react-native-web'],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  webpackFinal: async (config) => {
    if (config.module?.rules) {
      config.module.rules = config.module.rules.filter(
        (rule) =>
          !(
            rule &&
            typeof rule === 'object' &&
            'test' in rule &&
            String((rule as { test?: unknown }).test) === '/\\.css$/'
          )
      );
      config.module.rules.push({
        test: /\.css$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          'postcss-loader',
        ],
      });
    }

    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...(config.resolve.alias as Record<string, string>),
      '@sbaiahmed1/react-native-blur': path.resolve(__dirname, '../__mocks__/empty-module.js'),
    };

    return config;
  },
};

export default config;
