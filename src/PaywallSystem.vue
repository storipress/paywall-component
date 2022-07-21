<script lang="ts" setup>
import { useVModel } from '@vueuse/core'
import type {
  ApplyHandlerType,
  UserDialogHandler,
  UserDialogParams,
  UserDialogType,
} from './components/UserDialog/definition'
import { useAuth, useSite, useSubscription } from './composables'
import { Badge, Paywall, UserDialog } from './components'
import type { PaywallMachine } from './machine'
import Modals from './Modals.vue'
import { LoginReason, PaywallState } from './machine'
import { ArticlePlan } from './types'

const props = defineProps<{
  token: string | null
  favicon: string
  logo: string
  hasComment: boolean
  commentCount: number
  paywallMachine: PaywallMachine
}>()

const emit = defineEmits<{
  (event: 'clickComment'): void
  (event: 'update:token', token: string | null): void
}>()

let visible = $ref(false)
let modalVisible = $ref(false)
let dialogType = $ref<UserDialogType>('welcome')

const tokenRef = useVModel(props, 'token', emit)
const articleType = $computed(() => {
  const { reason, article } = props.paywallMachine.context
  if (!article) {
    return 'free'
  }

  if (reason === LoginReason.None) {
    return 'free'
  } else if (reason === LoginReason.NotLoggedIn) {
    return article.plan === ArticlePlan.Subscriber ? 'paid' : 'free'
  } else {
    return 'upgrade'
  }
})
const ready = $computed(() => props.paywallMachine.context.article)
const showBadge = $computed(() => {
  return ready
})
const showPaywall = $computed(() => {
  if (!ready) {
    return false
  }
  const { state, paywall } = props.paywallMachine
  return state.value === PaywallState.PaywallOrLogIn && paywall.value
})
let showPaywallForSignup = $ref(false)
let defaultEmailForSignup = $ref('')

const { siteSubscriptionInfo } = useSite()
const {
  subscriberProfile,
  refetchSubscriber,
  updateSubscriber,
  createSubscription,
  changeSubscription,
  cancelSubscription,
} = useSubscription()
const auth = useAuth(tokenRef)
const { onLogin, onSignup, onSignOut } = auth

const profile = $computed(() => {
  if (!tokenRef.value) {
    return null
  }
  return subscriberProfile.value
})

const onClick = async (email: string) => {
  const checkExistEmailAndShowDialog = async (showDialogType: UserDialogType) => {
    const result = await onSignup(email)
    if (result && result?.data.signUpSubscriber) {
      dialogType = showDialogType
      visible = true
    } else {
      onLogin({ email })
      modalVisible = true
    }
  }

  switch (articleType) {
    case 'free': {
      await checkExistEmailAndShowDialog('signupFree')
      break
    }
    case 'paid': {
      await checkExistEmailAndShowDialog('signupPremium')
      break
    }
    case 'upgrade':
      dialogType = 'upgradeAccount'
      visible = true
      break
  }
}

const currentSubscriptionPlan = computed<UserDialogType>(() => {
  return !profile || profile?.subscription_type === 'free' ? 'freeAccount' : 'paidAccount'
})
function badgeClick() {
  dialogType = profile?.id ? currentSubscriptionPlan.value : 'welcome'
  visible = true
}

const UPDATE_DIALOG = new Set([
  'signupFree',
  'freeAccount',
  'paidAccount',
  'accountPlan',
  'signupPremium',
  'upgradeAccount',
  'shareToTwitter',
  'subscribe',
])

const handlers: Record<ApplyHandlerType, UserDialogHandler> = {
  login: onLogin as UserDialogHandler,
  logout: onSignOut,
  update: updateSubscriber as UserDialogHandler,
  create: createSubscription as UserDialogHandler,
  change: changeSubscription as UserDialogHandler,
  cancel: cancelSubscription as UserDialogHandler,
}

const onApplyHandler = async ({ type, ...params }: UserDialogParams) => {
  const result = await handlers[type](params)
  if (UPDATE_DIALOG.has(dialogType)) {
    await refetchSubscriber()
    const { verified = false } = profile || {}
    if (type === 'create' && !verified && !result) {
      dialogType = 'confirmation'
      return
    }
  }

  if (result) {
    if (dialogType === 'confirmation') {
      dialogType = 'accountPlan'
    } else {
      modalVisible = true
      visible = false
    }
  } else if (type === 'login' && articleType !== 'upgrade' && 'email' in params) {
    visible = false
    showPaywallForSignup = true
    defaultEmailForSignup = params.email
  }
}

const onConfirmModal = () => {
  if (dialogType === 'upgradeAccount') {
    setTimeout(() => {
      dialogType = 'shareToTwitter'
      modalVisible = true
    }, 300)
  }
}

watch(tokenRef, async (token) => {
  if (token) {
    await refetchSubscriber()
    props.paywallMachine.checkPlan()
  } else {
    props.paywallMachine.resetState()
    dialogType = 'welcome'
  }
})
</script>

<template>
  <div class="pointer-events-none fixed bottom-0 flex w-full justify-center">
    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <Paywall
        v-if="showPaywall || showPaywallForSignup"
        class="paywall pointer-events-auto"
        :type="articleType"
        :publication-name="siteSubscriptionInfo?.name"
        :default-email="defaultEmailForSignup"
        @click="onClick"
        @click-sign-in="visible = true"
      />
    </transition>
    <transition
      appear
      enter-active-class="ease-in-out duration-500"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="ease-in-out duration-500"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <Badge
        v-if="showBadge"
        class="pointer-events-auto z-10 mb-8"
        :account-avatar="profile?.id && (profile?.avatar || favicon)"
        :login-state="!!profile?.id"
        @click="badgeClick"
        @click-comment="$emit('clickComment')"
      />
    </transition>
    <UserDialog
      v-model="visible"
      v-model:type="dialogType"
      :logo="logo"
      :site-data="siteSubscriptionInfo"
      :subscriber-data="profile || {}"
      class="pointer-events-auto"
      @apply-handler="onApplyHandler"
    />
    <Modals
      v-model="modalVisible"
      :logo="logo"
      :dialog-type="dialogType"
      :publication-name="siteSubscriptionInfo?.name"
      :email="profile?.email"
      @confirm="onConfirmModal"
    />
  </div>
</template>
