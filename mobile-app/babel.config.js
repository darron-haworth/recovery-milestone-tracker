module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // Module resolver for better import handling
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@shared': '../shared',
          '@components': './src/components',
          '@screens': './src/screens',
          '@services': './src/services',
          '@utils': './src/utils',
          '@store': './src/store',
          '@navigation': './src/navigation',
          '@hooks': './src/hooks',
          '@types': './src/types',
        },
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
      },
    ],
  ],
};
