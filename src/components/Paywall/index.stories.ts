import type { Story } from '@storybook/vue3'

import Badge from '../Auth/Badge/Badge.vue'
import Paywall from './Paywall.vue'

export default {
  title: 'Paywall',
}

const PaywallTemplate: Story = (args) => ({
  components: { Paywall, Badge },
  setup() {
    return { args }
  },
  template: `
  <Paywall v-bind="args" />
  <div class="flex justify-center">
    <Badge commentCount="2" class="absolute bottom-14 md:bottom-4" />
  </div>
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
