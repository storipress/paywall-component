import type { Story } from '@storybook/vue3'
import Badge from './Badge.vue'

export default {
  title: 'Auth/Badge',
  component: Badge,
}

const Template: Story = (args) => ({
  components: { Badge },
  setup() {
    return { args }
  },
  template: '<Badge v-bind="args" :user="user" />',
})

export const NoLogin = Template.bind({})
NoLogin.args = {}

export const NoLoginWithComment = Template.bind({})
NoLoginWithComment.args = {
  commentCount: 666,
}

export const Login = Template.bind({})
Login.args = {
  loginState: true,
}

export const LoginWithComment = Template.bind({})
LoginWithComment.args = {
  loginState: true,
  accountAvatar:
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
  commentCount: 666,
}
