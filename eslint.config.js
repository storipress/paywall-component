const antfu = require('@antfu/eslint-config').default
const prettier = require('eslint-plugin-prettier')
const storybook = require('eslint-plugin-storybook')

const ignores = ['*.md', '**/*.md', '.yarn/**', '**/*.toml', 'shims.d.ts', 'public/mockServiceWorker.js']

module.exports = antfu(
  {
    ignores,
    stylistic: false,
    plugins: { prettier, storybook },
    rules: {
      'vue/html-self-closing': 'off',
      'vue/singleline-html-element-content-newline': 'off',

      'antfu/top-level-function': 'error',
      'prettier/prettier': 'error',
      ...storybook.configs.recommended.rules,
    },
  },
  { ignores },
)
