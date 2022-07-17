import type { Story, Meta } from '@storybook/vue3'
import { defineComponent, h, onMounted, ref, watch } from 'vue'

import { UserDialog } from '../index'
import { useAuth, useSite, useSubscription } from '../../composables'
// @ts-expect-error can't load type in a story
import spLogo from '../../../assets/sp-logo-white.svg'

const fullScreenDecorators: Meta['decorators'] = [
  (story) =>
    defineComponent({
      setup() {
        return () => h('div', { style: { width: '100vw', height: '100vh' } }, h(story()))
      },
    }),
]

export default {
  title: 'UserDialog',
  parameters: {
    layout: 'fullscreen',
  },
  component: UserDialog,
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

export const EmailLogin: Story = UserDialogTemplate.bind({})
EmailLogin.args = {
  type: 'welcome',
}
EmailLogin.decorators = fullScreenDecorators
export const SocialLogin: Story = UserDialogTemplate.bind({})
SocialLogin.args = {
  type: 'welcomeInSocial',
}
SocialLogin.decorators = fullScreenDecorators

export const SignupFreeArticle: Story = UserDialogTemplate.bind({})
SignupFreeArticle.args = {
  type: 'signupFree',
}
SignupFreeArticle.decorators = fullScreenDecorators
export const SignupPaid: Story = UserDialogTemplate.bind({})
SignupPaid.args = {
  type: 'signupPremium',
}
SignupPaid.decorators = fullScreenDecorators
export const UpgradeAccount: Story = UserDialogTemplate.bind({})
UpgradeAccount.args = {
  type: 'upgradeAccount',
}
UpgradeAccount.decorators = fullScreenDecorators

export const ManageFreeAccount: Story = UserDialogTemplate.bind({})
ManageFreeAccount.args = {
  type: 'freeAccount',
}
ManageFreeAccount.decorators = fullScreenDecorators
export const ManagePaidAccount: Story = UserDialogTemplate.bind({})
ManagePaidAccount.args = {
  type: 'paidAccount',
}
ManagePaidAccount.decorators = fullScreenDecorators

export const VerifyEmail: Story = UserDialogTemplate.bind({})
VerifyEmail.args = {
  type: 'confirmation',
}
VerifyEmail.decorators = fullScreenDecorators

const PreviewTemplate: Story = (args) => ({
  components: { UserDialog },
  setup() {
    args.logo = spLogo

    return { args }
  },
  template: '<UserDialog v-bind="args" />',
})

export const PreviewFree: Story = PreviewTemplate.bind({})
PreviewFree.args = {
  type: 'subscribe',
  useSlideOver: false,
  siteData: {
    name: 'Storipress',
    subscription: false,
  },
}
export const PreviewDefault: Story = PreviewTemplate.bind({})
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
