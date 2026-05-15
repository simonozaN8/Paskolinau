const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Set the app root explicitly
config.projectRoot = __dirname;

module.exports = config;
