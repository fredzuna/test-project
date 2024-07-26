/** @type {import("eslint").Linter.Config} */
const config = {
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
      "project": false
    },
    "plugins": [
      "@typescript-eslint"
    ],
    "extends": [
      "next/core-web-vitals",
      "plugin:@typescript-eslint/recommended-type-checked",
      "plugin:@typescript-eslint/stylistic-type-checked"
    ],
    "rules": {
      // turn this on before prod
      "no-console" : "error",
      "@typescript-eslint/array-type": "off",
      "@typescript-eslint/consistent-type-definitions": "off",
      "@typescript-eslint/consistent-type-imports": [
        "off",
        {
          "prefer": "type-imports",
          "fixStyle": "inline-type-imports"
        }
      ],
      "@typescript-eslint/no-unused-vars": [
        "off",
        {
          "argsIgnorePattern": "^_"
        }
      ],
      "@typescript-eslint/require-await": "off",
      "@typescript-eslint/no-misused-promises": [
        "off",
        {
          "checksVoidReturn": {
            "attributes": false
          }
        }
      ]
    }
  }
  module.exports = config;