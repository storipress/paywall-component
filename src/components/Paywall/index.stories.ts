import type { Story } from '@storybook/vue3'
import { onUnmounted, ref } from 'vue'

import { Modal, UserDialog } from '../index'
import { useAuth, useSite, useSubscription, useUserDialog } from '../../composables'
import spLogo from '../../../assets/sp-logo-white.svg'
import Paywall from './Paywall.vue'

export default {
  title: 'Paywall',
}

const PaywallTemplate: Story = (args) => ({
  components: { Paywall, UserDialog, Modal },
  setup() {
    args.publicationName = 'Storipress' // TODO api

    const visible = ref(false)
    const modalVisible = ref(false)
    const dialogType = ref('welcome')
    const { siteSubscriptionInfo } = useSite()
    const { subscriberProfile } = useSubscription()
    const { isAuth, onSignup } = useAuth()
    const { switchApplyHandler } = useUserDialog(dialogType.value)

    const onClick = async ({ email }) => {
      switch (args.paywallType) {
        case 'free': {
          const result = await onSignup({ email })
          if (result?.data.signUpSubscriber) {
            dialogType.value = 'signupFree'
            visible.value = true
          } else {
            modalVisible.value = true
          }
          break
        }
        case 'paid':
          await onSignup({ email })
          dialogType.value = 'signupPremium'
          visible.value = true
          break
        case 'upgrade':
          dialogType.value = 'upgradeAccount'
          visible.value = true
          break
      }
    }

    const onApplyHandler = async (handler) => {
      const result = await switchApplyHandler()?.(handler)
      if (result) {
        visible.value = false
        modalVisible.value = true
      }
    }

    // onUnmounted(() => {
    //   localStorage.removeItem('test-token')
    // })

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
  <Paywall v-bind="args" @click="onClick" @click-sign-in="visible = true" />
  <UserDialog v-model="visible" :type="dialogType" :logo="spLogo" :site-data="siteSubscriptionInfo" :subscriber-data="subscriberProfile" @apply-handler="onApplyHandler" />
  <Modal v-model="modalVisible" :logo="spLogo" title="We’ve sent you a login link!" sub="If the email doesn't arrive in 3 minutes, check your spam folder." button="Close" @click="modalVisible = false" />
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
