<script lang="ts" setup>
import { useVModel } from '@vueuse/core'
import { useAuth, useSite, useSubscription, useUserDialog } from './composables'
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
let dialogType = $ref('welcome')

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
const { siteSubscriptionInfo } = useSite()
const { subscriberProfile, refetchSubscriber } = useSubscription()
const auth = useAuth(tokenRef)
const { onLogin, onSignup } = auth
const { switchApplyHandler } = useUserDialog($$(dialogType), auth)

const onClick = async (email: string) => {
  switch (articleType) {
    case 'free': {
      const result = await onSignup(email)
      if (result && result?.data.signUpSubscriber) {
        dialogType = 'signupFree'
        visible = true
      } else {
        onLogin({ email })
        modalVisible = true
      }
      break
    }
    case 'paid':
      await onSignup(email)
      dialogType = 'signupPremium'
      visible = true
      break
    case 'upgrade':
      dialogType = 'upgradeAccount'
      visible = true
      break
  }
}

function badgeClick() {
  dialogType = subscriberProfile.value.id ? 'accountPlan' : 'welcome'
  visible = true
}

const UPDATE_DIALOG = new Set([
  'signupFree',
  'freeAccount',
  'accountPlan',
  'signupPremium',
  'upgradeAccount',
  'shareToTwitter',
  'subscribe',
])

const onApplyHandler = async (params: any) => {
  const result = await switchApplyHandler()?.(params)
  if (UPDATE_DIALOG.has(dialogType)) {
    await refetchSubscriber()
    const { subscribed, verified } = subscriberProfile.value
    if (subscribed && !verified) {
      dialogType = 'confirmation'
      return
    }
  }

  if (result) {
    if (dialogType === 'confirmation') {
      dialogType = 'accountPlan'
    } else {
      visible = false
      modalVisible = true
    }
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
        v-if="showPaywall"
        class="pointer-events-auto"
        :type="articleType"
        :publication-name="siteSubscriptionInfo?.name"
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
        :account-avatar="subscriberProfile.id && (subscriberProfile?.avatar || favicon)"
        :login-state="!!subscriberProfile.id"
        @click="badgeClick"
        @click-comment="$emit('clickComment')"
      />
    </transition>
    <UserDialog
      v-model="visible"
      class="pointer-events-auto"
      :type="dialogType"
      :logo="logo"
      :site-data="siteSubscriptionInfo"
      :subscriber-data="subscriberProfile"
      @apply-handler="onApplyHandler"
    />
    <Modals
      v-model="modalVisible"
      :logo="logo"
      :dialog-type="dialogType"
      :publication-name="siteSubscriptionInfo?.name"
      :email="subscriberProfile?.email"
      @confirm="onConfirmModal"
    />
  </div>
</template>
