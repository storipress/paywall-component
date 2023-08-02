import type { Story } from '@storybook/vue3'
import { ref } from 'vue'

import spLogo from '@assets/sp-logo-white.svg'
import { Modal, UserDialog } from '../index'
import { useAuth, useSite, useSubscription } from '../../composables'
import Paywall from './Paywall.vue'

export default {
  title: 'Paywall',
}

const PaywallTemplate: Story = (args) => ({
  components: { Paywall, UserDialog, Modal },
  setup() {
    const visible = ref(false)
    const modalVisible = ref(false)
    const dialogType = ref('welcome')
    const { siteSubscriptionInfo } = useSite()
    const { subscriberProfile } = useSubscription()
    const { isAuth, onLogin, onSignup, onVerifyEmail, onSignInSubscriber } = useAuth()

    const onClick = async (email) => {
      switch (args.type) {
        case 'free': {
          const result = await onSignup(email)
          if (result && result?.data.signUpSubscriber) {
            dialogType.value = 'signupFree'
            visible.value = true
          } else {
            onLogin({ email })
            modalVisible.value = true
          }
          break
        }
        case 'paid':
          await onSignup(email)
          dialogType.value = 'signupPremium'
          visible.value = true
          break
        case 'upgrade':
          dialogType.value = 'upgradeAccount'
          visible.value = true
          break

        // no default
      }
    }

    const onApplyHandler = async ({ email }) => {
      const result = await onLogin({ email })
      if (result) {
        visible.value = false
        modalVisible.value = true
      }
    }

    const urlParams = new URLSearchParams(window.location.search)
    const actionQuery = urlParams.get('action')
    const token = urlParams.get('token')
    if (actionQuery && token) {
      switch (actionQuery) {
        case 'verify-email':
          onVerifyEmail(token)
          break
        case 'sign-in':
          onSignInSubscriber(token)
          break

        // no default
      }
    }

    return {
      args,
      visible,
      modalVisible,
      dialogType,
      spLogo,
      onClick,
      onApplyHandler,
      siteSubscriptionInfo,
      subscriberProfile,
      isAuth,
    }
  },
  template: `
  login status: {{ !!isAuth }}
  <Paywall class="fixed bottom-9" v-bind="args" :publication-name="siteSubscriptionInfo?.name" @click="onClick" @click-sign-in="visible = true" />
  <UserDialog v-model="visible" :type="dialogType" :logo="spLogo" :site-data="siteSubscriptionInfo" :subscriber-data="subscriberProfile" @apply-handler="onApplyHandler" />
  <Modal v-model="modalVisible" :logo="spLogo" title="We’ve sent you a login link!" sub="If the email doesn't arrive in 3 minutes, check your spam folder." button="Close" @click="modalVisible = false" />
  `,
})
export const Free = PaywallTemplate.bind({})
Free.args = {
  type: 'free',
}
export const Paid = PaywallTemplate.bind({})
Paid.args = {
  type: 'paid',
}
export const Upgrade = PaywallTemplate.bind({})
Upgrade.args = {
  type: 'upgrade',
}
