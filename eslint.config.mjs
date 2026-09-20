import { defineConfig } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import jest from "eslint-plugin-jest";
import prettier from "eslint-config-prettier/flat";

export default defineConfig([
  ...nextVitals,

  {
    files: ["**/*.test.js", "**/*.test.jsx"],
    ...jest.configs["flat/recommended"],
  },

  prettier,
]);
