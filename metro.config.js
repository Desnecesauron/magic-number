const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // Enables require.context() for Expo Router
  isCSSEnabled: true,
});

module.exports = config;
