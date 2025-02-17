const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {  transformer: {
    // 启用 Babel 配置（关键！）
    babelTransformerPath: require.resolve('react-native-typescript-transformer'), // 如果不用 TypeScript 可移除
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true, // 建议开启以优化性能
      },
    }),
  },
  resolver: {
    // 同步 Babel 的别名配置
    resolverMainFields: ['browser', 'main', 'module'],
    sourceExts: [...defaultConfig.resolver.sourceExts, 'cjs'], // 扩展支持的文件类型
  },};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
