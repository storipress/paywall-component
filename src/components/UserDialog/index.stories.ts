import type { Story } from '@storybook/vue3'

import LoginWithEmail from './Login/Email.vue'
import LoginWithSocial from './Login/Social.vue'
import Signup from './Signup/Signup.vue'
import ManageAccount from './ManageAccount/ManageAccount.vue'

export default {
  title: 'UserDialog',
}

const SignupTemplate: Story = (args) => ({
  components: { Signup },
  setup() {
    return { args }
  },
  template: '<Signup v-bind="args" />',
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

export const EmailLogin: Story = (args) => ({
  components: { LoginWithEmail },
  setup() {
    return { args }
  },
  template: '<LoginWithEmail />',
})
export const SocialLogin: Story = (args) => ({
  components: { LoginWithSocial },
  setup() {
    return { args }
  },
  template: '<LoginWithSocial />',
})

const ManageAccountTemplate: Story = (args) => ({
  components: { ManageAccount },
  setup() {
    return { args }
  },
  template: '<ManageAccount v-bind="args" />',
})
export const ManageFreeAccount = ManageAccountTemplate.bind({})
ManageFreeAccount.args = {
  type: 'freeAccount',
}
export const ManagePaidAccount = ManageAccountTemplate.bind({})
ManagePaidAccount.args = {
  type: 'paidAccound',
}
