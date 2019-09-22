module.exports = {
  setupFiles: ["<rootDir>/src/setupTests.ts"],
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  globals: {
    "ts-jest": {
      tsConfig: {
        importHelpers: true
      }
    }
  }
};
