import path from 'node:path'
import type { UserConfig } from 'vitest/config'
import { defineConfig } from 'vitest/config'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import AutoImport from 'unplugin-auto-import/vite'
import VueI18n from '@intlify/unplugin-vue-i18n/vite'

const baseConfig: UserConfig = {
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
      '@assets/': `${path.resolve(__dirname, 'src/assets')}/`,
    },
  },
  build: {
    lib: {
      entry: './src/entry.ts',
      name: 'BuilderComponent',
      fileName: 'builder-component',
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        '@apollo/client',
        '@headlessui/vue',
        '@stripe/stripe-js',
        '@types/lodash-es',
        '@vue/apollo-composable',
        '@vueuse/core',
        '@vueuse/head',
        'dayjs',
        'graphql',
        'graphql-tag',
        'lodash-es',
        'p-retry',
        'tiny-invariant',
        'ts-pattern',
        'vee-validate',
        'vue',
        'vue-i18n',
        'vue-router',
        'yup',
      ],
    },
    minify: false,
  },
  plugins: [
    // https://github.com/hannoeru/vite-plugin-pages
    Pages(),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: ['vue', 'vue/macros', 'vue-router', '@vueuse/core', '@vueuse/head', 'vue-i18n'],
      dts: true,
    }),

    // https://github.com/intlify/bundle-tools/tree/main/packages/vite-plugin-vue-i18n
    VueI18n({
      runtimeOnly: true,
      compositionOnly: true,
      include: [path.resolve(__dirname, 'locales/**')],
    }),
  ],

  // https://github.com/vitest-dev/vitest
  test: {
    environment: 'jsdom',
  },
}

export default defineConfig(({ mode }): UserConfig => {
  if (mode === 'browser') {
    return {
      ...baseConfig,
      mode: 'production',
      define: {
        'process.env.NODE_ENV': JSON.stringify('production'),
      },
      build: {
        lib: {
          entry: './src/entry.ts',
          name: 'BuilderComponent',
          fileName: 'builder-component',
          formats: ['es'],
        },
        minify: false,
      },
      plugins: [
        baseConfig.plugins,

        Vue({
          isProduction: true,
        }),
      ],
    }
  }

  return {
    ...baseConfig,
    plugins: [baseConfig.plugins],
  }
})
