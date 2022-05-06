import type { Story } from '@storybook/vue3'
import { onUnmounted, ref } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

import { UserDialog } from '../index'
import spLogo from '../../../assets/sp-logo-white.svg'
import Paywall from './Paywall.vue'

export default {
  title: 'Paywall',
}

const PaywallTemplate: Story = (args) => ({
  components: { Paywall, UserDialog },
  setup() {
    args.publicationName = 'Storipress' // TODO api

    const visible = ref(false)
    const dialogType = ref('welcome')

    const { mutate } = useMutation(gql`
      mutation SignUpSubscriber($email: Email!, $referer: String!, $from: String!) {
        signUpSubscriber(input: { email: $email, referer: $referer, from: $from })
      }
    `)
    const onSignup = async (val) => {
      try {
        const { data } = await mutate({
          email: val,
          referer: location.origin,
          from: document.referrer,
        })
        if (data.signUpSubscriber) {
          localStorage.setItem('test-token', data.signUpSubscriber)
          args.paywallType === 'free' ? (dialogType.value = 'signupFree') : (dialogType.value = 'signupPremium')
          visible.value = true
        }
      } catch (e) {}
    }

    const onClick = (val) => {
      switch (args.paywallType) {
        case 'free':
          onSignup(val)
          break
        case 'paid':
          onSignup(val)
          break
        case 'upgrade':
          dialogType.value = 'upgradeAccount'
          visible.value = true
          break
      }
    }

    const onApplyHandler = (result) => {
      if (result) {
        visible.value = false
      }
    }

    onUnmounted(() => {
      localStorage.removeItem('test-token')
    })

    return { args, visible, dialogType, spLogo, onClick, onApplyHandler }
  },
  template: `
  <Paywall v-bind="args" @click="onClick" @click-sign-in="visible = true" />
  <UserDialog v-model="visible" :type="dialogType" :logo="spLogo" @apply-handler="onApplyHandler" />
  `,
})
export const Free = PaywallTemplate.bind({})
Free.args = {
  paywallType: 'free',
  type: 'free',
}
export const Paid = PaywallTemplate.bind({})
Paid.args = {
  paywallType: 'paid',
  type: 'paid',
}
export const Upgrade = PaywallTemplate.bind({})
Upgrade.args = {
  paywallType: 'upgrade',
  type: 'upgrade',
}
