import { app } from '@storybook/vue3'
import { ApolloClients } from '@vue/apollo-composable'
import { worker } from '../src/mocks/browser'
import { apolloClient } from '../src/api/client'
import '../assets/styles/iconfont.css'
import '../src/styles/main.css'

worker.start()

app.provide(ApolloClients, {
  default: apolloClient,
})

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

export const decorators = [
  (story) => ({
    components: { story },
    // paywall component css will scope under #paywall
    template: '<div id="paywall"><story /></div>',
  }),
]
