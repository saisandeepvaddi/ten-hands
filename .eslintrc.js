module.exports = {
  extends: "@saisandeepvaddi/eslint-config-typescript",
  plugins: ["simple-import-sort", "import"],
  rules: {
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "prettier/prettier": 0
  },
};
