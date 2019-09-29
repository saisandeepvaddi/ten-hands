module.exports = {
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  watchPlugins: ["jest-watch-yarn-workspaces"],
  globals: {
    "ts-jest": {
      diagnostics: false,
      tsConfig: {
        importHelpers: true
      }
    }
  }
};
