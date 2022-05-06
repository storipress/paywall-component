import type { Story } from '@storybook/vue3'
import { onMounted, ref, watch } from 'vue'

import { UserDialog } from '../index'
import { useUserDialog } from '../../composables'
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
    args.logo = spLogo

    const { visible } = useDialog()
    const { switchApplyHandler } = useUserDialog(args.type)

    const onApplyHandler = (handler) => {
      switchApplyHandler()?.(handler)
    }

    return { args, visible, onApplyHandler }
  },
  template: '<UserDialog v-model="visible" v-bind="args" @apply-handler="onApplyHandler"/>',
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
