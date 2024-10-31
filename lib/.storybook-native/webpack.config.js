const path = require('path');

module.exports = ({ config }) => {
  config.resolve.alias = {
    ...(config.resolve.alias || {}),
    'react-native$': 'react-native-web',
  };

  config.resolve.extensions = [
    '.web.js',
    '.web.ts',
    '.web.tsx',
    '.js',
    '.jsx',
    '.ts',
    '.tsx',
    '.json',
  ];

  return config;
};
