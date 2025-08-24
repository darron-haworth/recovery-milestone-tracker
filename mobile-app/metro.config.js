const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

/**
 * Optimized Metro configuration for Recovery Milestone Tracker
 * https://reactnative.dev/docs/metro
 */
const config = {
  resolver: {
    // Add shared directory to module resolution
    extraNodeModules: {
      '@shared': path.resolve(__dirname, '../shared'),
    },
    // Resolve these extensions in order
    sourceExts: ['js', 'jsx', 'ts', 'tsx', 'json'],
    // Platform-specific extensions
    platforms: ['android', 'ios', 'native', 'web'],
    // Use Watchman for better performance
    useWatchman: true,
    // Enable symlinks
    enableSymlinks: true,
    // Asset extensions
    assetExts: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'ttf', 'otf', 'woff', 'woff2'],
  },
  transformer: {
    // Enable Hermes for better performance
    unstable_allowRequireContext: true,
    // Optimize for development
    minifierConfig: {
      keep_fnames: true,
      mangle: {
        keep_fnames: true,
      },
    },
  },
  // Watch folders for better performance
  watchFolders: [
    path.resolve(__dirname, '../shared'),
    path.resolve(__dirname, 'node_modules'),
  ],
  // Optimize for development
  maxWorkers: 2,
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
