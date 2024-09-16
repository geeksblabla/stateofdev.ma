/** @type {import("prettier").Config} */
module.exports = {
  plugins: [require.resolve('prettier-plugin-astro')],
  trailingComma: 'none',
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro'
      }
    }
  ]
}