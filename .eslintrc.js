module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['@antfu/vue', '@vue/prettier', 'plugin:storybook/recommended'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 13,
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  plugins: ['vue', '@typescript-eslint'],
}
