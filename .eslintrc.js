module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['@antfu', 'prettier', 'prettier/prettier', 'plugin:storybook/recommended'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',

    'antfu/if-newline': 'off',
    'vue/component-name-in-template-casing': 'off',
  },
}
