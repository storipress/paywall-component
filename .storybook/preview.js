import { app } from '@storybook/vue3'
import { ApolloClients } from '@vue/apollo-composable'
import { apolloClient } from '../src/api/client'
app.provide(ApolloClients, {
  default: apolloClient,
})

import '../assets/styles/iconfont.css'
import '../src/styles/main.css'

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}
