import type { Story } from '@storybook/vue3'

import LoginWithEmail from './Login/Email.vue'
import LoginWithSocial from './Login/Social.vue'
import Signup from './Signup/Signup.vue'
import ManageAccount from './ManageAccount/ManageAccount.vue'

export default {
  title: 'UserDialog',
}

export const SignupFreeArticle: Story = (args) => ({
  components: { Signup },
  setup() {
    return { args }
  },
  template: '<Signup />',
})
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
ManageFreeAccount.args = {}
export const ManagePaidAccount = ManageAccountTemplate.bind({})
ManagePaidAccount.args = {
  isPaidPlan: true,
}
