const AutoImport = require('unplugin-auto-import/vite').default

module.exports = {
  "stories": [
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials"
  ],
  "framework": "@storybook/vue3",
  "core": {
    "builder": "@storybook/builder-vite"
  },
  viteFianl(config, {configType}) {
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
    config.plugins = config.plugins || []
    config.plugins.push(
      // https://github.com/antfu/unplugin-auto-import
      AutoImport({
        imports: ['vue', 'vue/macros', 'vue-router', '@vueuse/core', '@vueuse/head'],
        dts: true,
      }),
    )

  }
}
