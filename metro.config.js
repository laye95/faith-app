const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);
config.resolver.sourceExts.push('mjs');
delete config.watcher?.unstable_workerThreads;

module.exports = withNativeWind(config, { input: './global.css' });
