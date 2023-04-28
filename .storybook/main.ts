import { StorybookConfig } from '@storybook/vue3-vite'
import turbosnap from 'vite-plugin-turbosnap'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-interactions'],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  viteFinal(config, { configType }) {
    if (configType === 'PRODUCTION') {
      config.plugins ??= []
      config.plugins.push(
        turbosnap({
          rootDir: config.root as string,
        })
      )
    }
    return config
  },
  docs: {
    autodocs: true,
  },
}

export default config
