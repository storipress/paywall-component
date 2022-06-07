import type { Story } from '@storybook/vue3'
import { onMounted, ref, watch } from 'vue'

import { UserDialog } from '../index'
import { useAuth, useSite, useSubscription, useUserDialog } from '../../composables'
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
    const { switchApplyHandler } = useUserDialog(args.type)
    const { siteSubscriptionInfo } = useSite()
    const { isAuth, onSignOut } = useAuth()
    const { subscriberProfile } = useSubscription()

    args.logo = spLogo
    args.auth = isAuth
    // if (!isAuth) {
    //   args.type = 'welcome'
    // }

    const onApplyHandler = (handler) => {
      switchApplyHandler()?.(handler)
    }

    return { args, visible, onApplyHandler, onSignOut, siteSubscriptionInfo, subscriberProfile, isAuth }
  },
  template: `
  login status: {{ !!isAuth }}
  <UserDialog
    v-model="visible"
    v-bind="args"
    :site-data="siteSubscriptionInfo"
    :subscriber-data="subscriberProfile"
    @apply-handler="onApplyHandler"
    @sign-out="onSignOut"
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
  type: 'paidAccound',
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
