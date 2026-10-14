import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import svelte from "eslint-plugin-svelte";
import globals from "globals";

export default [
  {
    ignores: ["dist/**", ".astro/**", "node_modules/**", "coverage/**"],
  },
  js.configs.recommended,
  ...tsPlugin.configs["flat/recommended"],
  ...svelte.configs["flat/recommended"],
  ...svelte.configs["flat/prettier"],
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,svelte}"],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        extraFileExtensions: [".svelte", ".astro"],
        parser: tsParser,
      },
    },
    rules: {
      semi: ["error", "always"],
    },
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      parserOptions: { sourceType: "module" },
    },
  },
  {
    files: ["**/*.{config.js,config.cjs,config.mjs}", "*.config.{js,cjs,mjs}"],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ["src/env.d.ts"],
    rules: {
      "@typescript-eslint/triple-slash-reference": "off",
    },
  },
  {
    files: ["**/*.svelte"],
    rules: {
      "svelte/require-each-key": "off",
    },
  },
  {
    files: ["src/lib/components/ui/dialog/dialog-portal.svelte"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
];
