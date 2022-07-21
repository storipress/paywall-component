import type { Story } from '@storybook/vue3'
import { onMounted, ref, watch } from 'vue'

import { UserDialog } from '../index'
import { useAuth, useSite, useSubscription } from '../../composables'
import spLogo from '../../../assets/sp-logo-white.svg'

export default {
  title: 'UserDialog',
}

function useDialog() {
  const visible = ref(false)
  onMounted(() => (visible.value = true))
  watch(visible, (val) => {
    if (!val) {
      setTimeout(() => {
        visible.value = true
      }, 1000)
    }
  })
  return { visible }
}

const UserDialogTemplate: Story = (args) => ({
  components: { UserDialog },
  setup() {
    const { visible } = useDialog()
    const { siteSubscriptionInfo } = useSite()
    const { subscriberProfile, updateSubscriber, createSubscription, changeSubscription, cancelSubscription } =
      useSubscription()
    const { onLogin, onSignOut } = useAuth()

    args.logo = spLogo

    const handlers = {
      login: onLogin,
      logout: onSignOut,
      update: updateSubscriber,
      create: createSubscription,
      change: changeSubscription,
      cancel: cancelSubscription,
    }
    const onApplyHandler = ({ type, ...params }) => {
      handlers[type](params)
    }

    return { args, visible, siteSubscriptionInfo, subscriberProfile, onApplyHandler }
  },
  template: `
  <UserDialog
    v-model="visible"
    v-bind="args"
    :site-data="siteSubscriptionInfo"
    :subscriber-data="subscriberProfile"
    @apply-handler="onApplyHandler"
  />
  `,
})

export const EmailLogin = UserDialogTemplate.bind({})
EmailLogin.args = {
  type: 'welcome',
}
export const SocialLogin = UserDialogTemplate.bind({})
SocialLogin.args = {
  type: 'welcomeInSocial',
}

export const SignupFreeArticle = UserDialogTemplate.bind({})
SignupFreeArticle.args = {
  type: 'signupFree',
}
export const SignupPaid = UserDialogTemplate.bind({})
SignupPaid.args = {
  type: 'signupPremium',
}
export const UpgradeAccount = UserDialogTemplate.bind({})
UpgradeAccount.args = {
  type: 'upgradeAccount',
}

export const ManageFreeAccount = UserDialogTemplate.bind({})
ManageFreeAccount.args = {
  type: 'freeAccount',
}
export const ManagePaidAccount = UserDialogTemplate.bind({})
ManagePaidAccount.args = {
  type: 'paidAccount',
}

export const VerifyEmail = UserDialogTemplate.bind({})
VerifyEmail.args = {
  type: 'confirmation',
}

const PreviewTemplate: Story = (args) => ({
  components: { UserDialog },
  setup() {
    args.logo = spLogo

    return { args }
  },
  template: '<UserDialog v-bind="args" />',
})

export const PreviewFree = PreviewTemplate.bind({})
PreviewFree.args = {
  type: 'subscribe',
  useSlideOver: false,
  siteData: {
    name: 'Storipress',
    subscription: false,
  },
}
export const PreviewDefault = PreviewTemplate.bind({})
PreviewDefault.args = {
  type: 'subscribe',
  useSlideOver: false,
  siteData: {
    name: 'Storipress',
    subscription: true,
    monthly_price: '10',
    yearly_price: '100',
  },
}
