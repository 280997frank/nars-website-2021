module.exports = {
  parser: "@typescript-eslint/parser", // add the TypeScript parser
  plugins: [
    "svelte3",
    "@typescript-eslint", // add the TypeScript plugin
  ],
  overrides: [
    // this stays the same
    {
      files: ["*.svelte"],
      processor: "svelte3/svelte3",
    },
  ],
  env: {
    browser: true,
    node: true,
  },
  rules: {
    // ...
    "@typescript-eslint/no-var-requires": 0,
  },
  settings: {
    "svelte3/typescript": () => require("typescript"), // pass the TypeScript package to the Svelte plugin
    "svelte3/ignore-styles": () => true,
    // OR
    // "svelte3/typescript": true, // load TypeScript as peer dependency
    // ...
  },
  parserOptions: {
    // add these parser options
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
    extraFileExtensions: [".svelte"],
  },
  extends: [
    // then, enable whichever type-aware rules you want to use
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    // "plugin:@typescript-eslint/recommended-requiring-type-checking",
  ],
};
