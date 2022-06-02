import type { Story } from '@storybook/vue3'
import { ref } from 'vue'
import { userEvent, within } from '@storybook/testing-library'
import spLogo from '../../../assets/sp-logo-white.svg'
import twitterLogo from '../../../assets/icons-twitter.svg'

import { Button } from '../index'
import Modal from './Modal.vue'

export default {
  title: 'Modal',
  component: Modal,
}

async function play({ canvasElement }) {
  const canvas = within(canvasElement)
  const button = await canvas.getByRole('button', { name: 'open' })
  await userEvent.click(button)
}

const Template: Story = (args) => ({
  components: { Modal },
  setup() {
    const visible = ref(false)
    return { args, visible }
  },
  template:
    '<button @click="visible = true">open</button><Modal v-model="visible" v-bind="args" @click="visible = false" />',
})

export const Default = Template.bind({})
Default.args = {}
Default.play = play

export const LoginLink = Template.bind({})
LoginLink.args = {
  logo: spLogo,
  title: 'We’ve sent you a login link!',
  sub: `If the email doesn't arrive in 3 minutes, check your spam folder.`,
  button: 'Close',
}
LoginLink.play = play

export const Upgrade = Template.bind({})
Upgrade.args = {
  logo: spLogo,
  title: 'Thank you!',
  sub: 'You’re subscribed as test@storipress.com',
  button: 'Next',
}
Upgrade.play = play

export const UpgradeAndShare: Story = (args) => ({
  components: { Modal, Button },
  setup() {
    const visible = ref(false)
    args.logo = spLogo
    args.title = 'Spread the word'
    args.sub = 'If you want to help Vice even more, share your reason for subscribing.'

    return { args, visible, twitterLogo }
  },
  template: `
  <button @click="visible = true">open</button>
  <Modal v-model="visible" v-bind="args" @click="visible = false">
    <template #button>
      <div class="mt-[1.7rem] flex flex-col items-center">
        <Button primary rounded color-hex="#55acee" class="w-[5.1rem] mb-[0.56rem] min-h-[2rem] h-8 mb-2">
          <template #buttonText>
            <img :src="twitterLogo" class="w-4 mr-1" />
            <span class="text-caption font-bold w-full pr-6 text-white">Tweet</span>
          </template>
        </Button>
        <button class="text-caption font-bold text-black/50">
          <u>Maybe later</u>
        </button>
      </div>
    </template>
  </Modal>
  `,
})
UpgradeAndShare.play = play
