import type { Story } from '@storybook/vue3'
import { onMounted, ref, watch } from 'vue'

import LoginWithEmail from './Login/Email.vue'
import LoginWithSocial from './Login/Social.vue'
import Signup from './Signup/Signup.vue'
import ManageAccount from './ManageAccount/ManageAccount.vue'

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

const SignupTemplate: Story = (args) => ({
  components: { Signup },
  setup() {
    const { visible } = useDialog()
    return { args, visible }
  },
  template: '<Signup v-model="visible" v-bind="args" />',
})
export const SignupFreeArticle = SignupTemplate.bind({})
SignupFreeArticle.args = {
  type: 'signupFree',
  buttonText: 'Complete account',
}
export const SignupPaid = SignupTemplate.bind({})
SignupPaid.args = {
  type: 'signupPremium',
  buttonText: 'Sign up',
}
export const UpgradeAccount = SignupTemplate.bind({})
UpgradeAccount.args = {
  type: 'upgradeAccount',
  buttonText: 'Upgrade',
}
export const SubscribeInPreview = SignupTemplate.bind({})
SubscribeInPreview.args = {
  type: 'subscribe',
  buttonText: 'Subscribe',
  useSlideOver: false,
  plans: [
    { planName: 'Free', value: '0' },
    { planName: '$10/Month', value: '10' }, // site.monthly_price
    { planName: '$100/Year', value: '100' }, // site.yearly_price
  ]
}

export const EmailLogin: Story = (args) => ({
  components: { LoginWithEmail },
  setup() {
    const { visible } = useDialog()
    return { args, visible }
  },
  template: '<LoginWithEmail v-model="visible" />',
})
export const SocialLogin: Story = (args) => ({
  components: { LoginWithSocial },
  setup() {
    const { visible } = useDialog()
    return { args, visible }
  },
  template: '<LoginWithSocial v-model="visible" />',
})

const ManageAccountTemplate: Story = (args) => ({
  components: { ManageAccount },
  setup() {
    const { visible } = useDialog()
    return { args, visible }
  },
  template: '<ManageAccount v-model="visible" v-bind="args" />',
})
export const ManageFreeAccount = ManageAccountTemplate.bind({})
ManageFreeAccount.args = {
  type: 'freeAccount',
}
export const ManagePaidAccount = ManageAccountTemplate.bind({})
ManagePaidAccount.args = {
  type: 'paidAccound',
}
