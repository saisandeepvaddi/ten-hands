const { override } = require("customize-cra");

// const ReactRefreshPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

// const isDevelopment = process.env.NODE_ENV !== "production";
// const addReactRefresh = options =>
//   override(
//     isDevelopment && addBabelPlugin("react-refresh/babel"),
//     isDevelopment && addWebpackPlugin(new ReactRefreshPlugin(options))
//   );

// const path = require("path");

module.exports = override(
  (config) => ({
    ...config,
    target: "electron-renderer",
  })
  // addReactRefresh({ disableRefreshCheck: true })
);
