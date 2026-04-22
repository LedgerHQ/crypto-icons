import type { StorybookConfig } from '@storybook/react-webpack5';
import path from 'path';

const config: StorybookConfig = {
  stories: [
    '../__stories__/CryptoIcon.mdx',
    '../__stories__/CryptoIcon.stories.tsx',
    '../__stories__/DotIconCryptoIcon.mdx',
    '../__stories__/DotIconCryptoIcon.stories.tsx',
    '../__stories__/CryptoIconList.stories.tsx',
  ],
  addons: [
    '@storybook/addon-webpack5-compiler-swc',
    '@storybook/addon-essentials',
  ],
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
    return config;
  },
};

export default config;
