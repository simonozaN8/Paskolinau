// Only babel-preset-expo — expo-router transform is included (SDK 50+).
// Do NOT add babel-plugin-module-resolver here: it breaks expo-router's
// EXPO_ROUTER_APP_ROOT → require.context() inlining.
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
  };
};
