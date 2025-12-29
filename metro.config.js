const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const config = {
  resolver: {
    // This tells Metro to look for these extensions in order
    sourceExts: ['js', 'jsx', 'json', 'ts', 'tsx', 'cjs'],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);