import { StorybookConfig } from '@storybook/vue3-vite'
import turbosnap from 'vite-plugin-turbosnap'
import { mergeConfig } from 'vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-interactions'],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  viteFinal(config, { configType }) {
    if (configType === 'PRODUCTION') {
      return mergeConfig(config, {
        plugins: [
          turbosnap({
            rootDir: config.root as string,
          }),
        ],
      })
    }

    return mergeConfig(config, {
      server: {
        ignore: ['./env.example'],
      },
    })
  },
  docs: {
    autodocs: true,
  },
}

export default config
