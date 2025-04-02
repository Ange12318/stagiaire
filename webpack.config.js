const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Ajoute des fallbacks pour les modules Node.js
  config.resolve.fallback = {
    ...config.resolve.fallback,
    path: require.resolve('path-browserify'), // Polyfill pour 'path'
    fs: false, // Désactive 'fs' dans le build web
  };

  return config;
};