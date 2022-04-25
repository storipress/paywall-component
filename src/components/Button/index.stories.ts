import type { Story } from '@storybook/vue3'
import Button from './Button.vue'

export default {
  title: 'Button',
  component: Button,
}

const Template: Story = (args) => ({
  components: { Button },
  setup() {
    return { args }
  },
  template: '<Button v-bind="args" />',
})

export const Primary = Template.bind({})
Primary.args = {
  text: 'Sign Up',
  primary: true,
  class: 'w-[25.125rem] font-semibold text-lg',
}

export const Secondary = Template.bind({})
Secondary.args = {
  text: 'Free',
  rounded: true,
}

export const SecondaryInactive = Template.bind({})
SecondaryInactive.args = {
  text: '$5/Month',
  rounded: true,
  primary: true,
}
