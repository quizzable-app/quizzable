/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@repo/eslint-config/next.js"],
  rules: {
    "@next/next/no-img-element": "off",
    "turbo/no-undeclared-env-vars": "off",
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
};
