module.exports = {
  root: true,
  // This tells ESLint to load the config from the package "eslint-config-turbo"
  extends: ["turbo"],
  settings: {
    next: {
      rootDir: ["packages/*/"],
    },
  },
  rules: {
    "@next/next/no-html-link-for-pages": "off",
  },
  parserOptions: {
    babelOptions: {
      presets: [require.resolve("next/babel")],
    },
  },
};
