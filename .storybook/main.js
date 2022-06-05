const path = require('path')
const turbosnap = require('vite-plugin-turbosnap')
const AutoImport = require('unplugin-auto-import/vite')
const Vue = require('@vitejs/plugin-vue')

module.exports = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-interactions'],
  framework: '@storybook/vue3',
  core: {
    builder: '@storybook/builder-vite',
  },
  viteFinal(config, { configType }) {
    config.resolve = config.resolve || {}
    config.resolve.alias = config.resolve.alias || {}
    config.resolve.alias['@assets'] = `${path.resolve(__dirname, '../assets')}/`
    config.optimizeDeps =
      configType === 'PRODUCTION'
        ? config.optimizeDeps
        : {
            ...(config.optimizeDeps || {}),
            include: [
              ...(config?.optimizeDeps?.include || []),
              // Add all addons that imported in the `preview.js` or `preview.ts` file and used in exported constants
              '@storybook/vue3',
            ],
            exclude: ['path', 'fs', 'node:fs'],
          }
    config.plugins = (config.plugins || []).filter((plugin) => plugin.name !== 'vite:vue')

    config.plugins.push(
      Vue({
        reactivityTransform: true,
      }),
      // https://github.com/antfu/unplugin-auto-import
      AutoImport({
        imports: ['vue', 'vue/macros', 'vue-router', '@vueuse/core', '@vueuse/head', 'vue-i18n'],
        dts: false,
      })
    )

    if (configType === 'PRODUCTION') {
      config.plugins.push(turbosnap({ rootDir: config.root }))
    }

    return config
  },
}
