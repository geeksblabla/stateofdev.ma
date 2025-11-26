import antfu from "@antfu/eslint-config";

export default antfu({
  astro: true,
  react: true,
  typescript: {
    tsconfigPath: "tsconfig.json"
  },
  stylistic: {
    quotes: "double",
    semi: true
  }
}, {
  rules: {
    "unicorn/filename-case": [
      "error",
      {
        case: "kebabCase"
      }
    ],
    "ts/strict-boolean-expressions": "off",
    "style/comma-dangle": ["error", "never"]
  }
});
