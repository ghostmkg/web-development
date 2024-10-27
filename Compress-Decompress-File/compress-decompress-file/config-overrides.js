const path = require("path");

module.exports = function override(config) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    stream: require.resolve("stream-browserify"),
    assert: require.resolve("assert/"),
    util: require.resolve("util/"),
    // add other polyfills as needed
  };
  return config;
};
