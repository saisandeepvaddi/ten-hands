module.exports = {
  projects: ["<rootDir>/server/__tests__/*.js"],
  watchPlugins: ["jest-watch-yarn-workspaces"],
  testPathIgnorePatterns: ["<rootDir>/server/projects/"],
  watchPathIgnorePatterns: ["<rootDir>/server/projects/"]
};
