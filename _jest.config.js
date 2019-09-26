module.exports = {
  projects: [
    "<rootDir>/ui/src/__tests__/**/*.js",
    "<rootDir>/app/server/__tests__/**/*.js"
  ],
  watchPlugins: ["jest-watch-yarn-workspaces"],
  testPathIgnorePatterns: ["<rootDir>/server/projects/"],
  watchPathIgnorePatterns: ["<rootDir>/server/projects/"]
};
