import type { Story } from '@storybook/vue3'
import { ref } from 'vue'

import LoginDialog from '../UserDialog/Login/Email.vue'
import Paywall from './Paywall.vue'

export default {
  title: 'Paywall',
}

const PaywallTemplate: Story = (args) => ({
  components: { Paywall, LoginDialog },
  setup() {
    const visible = ref(false)
    return { args, visible }
  },
  template: `
  <Paywall v-bind="args" @click-sign-in="visible = true" />
  <LoginDialog v-model="visible" />
  `,
})
export const Free = PaywallTemplate.bind({})
Free.args = {
  type: 'free',
}
export const Paid = PaywallTemplate.bind({})
Paid.args = {
  isPaidPlan: true,
  type: 'paid',
}
export const Upgrade = PaywallTemplate.bind({})
Upgrade.args = {
  type: 'upgrade',
}
