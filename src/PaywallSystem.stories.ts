import type { Story } from '@storybook/vue3'
import { h, ref } from 'vue'
import logo from '@assets/sp-logo-white.svg'
import { apolloClient } from '../src/api/client'
import { usePaywallSystem } from './use-paywall'
import { useMockContext } from './mocks/context'
import PaywallSystem from './PaywallSystem.vue'

export default {
  title: 'PaywallSystem',
  component: PaywallSystem,
  parameters: {
    chromatic: { disableSnapshot: false },
  },
}

export const Default: Story = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  setup: () => {
    useMockContext({
      login: false,
    })

    const token = ref('')
    const { reloadRef, paywallMachine, updateToken } = usePaywallSystem(token, apolloClient)

    paywallMachine.setArticle({
      id: '1',
      plan: 'subscriber',
    })

    return () => {
      return h(PaywallSystem, {
        key: reloadRef.value,
        token: token.value,
        logo,
        paywallMachine,
        hasComment: true,
        commentCount: 27,
        onCommentClick: () => {},
        'onUpdate:token': updateToken,
      })
    }
  },
})
