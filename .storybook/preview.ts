import { setup, Parameters, Decorator } from '@storybook/vue3'
import { ApolloClients } from '@vue/apollo-composable'
import { worker } from '../src/mocks/browser'
import { apolloClient } from '../src/api/client'
import { env } from './env'
import { setStripeKey } from '../src/composables/stripe'
import '../src/styles/main.css'

setStripeKey(env.VITE_STRIPE_PUBLISHABLEKEY)

worker.start()

setup((app) => {
  app.provide(ApolloClients, {
    default: apolloClient,
  })
})

export const parameters: Parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

export const decorators: Decorator[] = [
  (story) => ({
    components: { story },
    // paywall component css will scope under #paywall
    template: '<div id="paywall"><story /></div>',
  }),
]
