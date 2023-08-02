<script setup lang="ts">
import { computed, inject, ref, unref } from 'vue'
import { RadioGroup, RadioGroupOption } from '@headlessui/vue'
import { Button } from '../../index'
import { useStripe } from '../../../composables'
import type { UserDialogParams } from '../definition'
import { LOADING_KEY } from '../../../types'

// ref: https://github.com/johnsoncodehk/volar/issues/1232, https://github.com/vitejs/vite/issues/8001
const props = withDefaults(
  defineProps<{
    type?: string
    button?: string
    siteData: {
      name: string
      email: string
      subscription: boolean
      monthly_price: string
      yearly_price: string
      monthly_price_id: string
      yearly_price_id: string
    }
    subscriberData: {
      email: string
      first_name: string
      last_name: string
      subscription: { interval: string; price: string }
      subscription_type: string
    }
    showBilling: boolean
  }>(),
  {
    type: 'free',
    button: '',
    useSlideOver: true,
  },
)

const emit = defineEmits<{
  (event: 'apply', params: UserDialogParams): void
}>()

const enabledStripe = computed(() => {
  // stripe is not enabled if the site does not offer a paid subscription or is in preview mode
  return props.siteData?.subscription && props.type !== 'subscribe'
})

const { reference, confirmPayment, isLoading: isPaymentLoading } = useStripe(enabledStripe.value)
const isSubscriptionLoading = inject(LOADING_KEY, false)

const plans = computed(() => {
  if (props.siteData?.subscription) {
    return [
      { name: 'Free', type: 'free' },
      {
        name: `$${props.siteData?.monthly_price}/Month`,
        type: 'month',
        priceId: props.siteData.monthly_price_id,
      },
      {
        name: `$${props.siteData?.yearly_price}/Year`,
        type: 'year',
        priceId: props.siteData.yearly_price_id,
      },
    ]
  }
  return []
})

const userPlan = computed(() => {
  if (props.type === 'accountPlan') {
    const index = plans.value?.findIndex((plan) => plan.type === props.subscriberData?.subscription?.interval)
    return index !== -1 ? index : 0
  } else {
    return props.type === 'signupFree' ? 0 : 1
  }
})

const email = ref(props.subscriberData?.email ?? '')
const firstName = ref(props.subscriberData?.first_name ?? '')
const lastName = ref(props.subscriberData?.last_name ?? '')
const selectedPlan = ref(userPlan.value)
const selected = computed({
  get: () => {
    return plans.value[selectedPlan.value]
  },
  set: (val) => {
    selectedPlan.value = plans.value.findIndex((plan) => plan === val)
  },
})

const showBillingInput = computed(() => {
  return (
    props.siteData?.subscription &&
    (props.subscriberData?.subscription_type === 'free' || props.showBilling) &&
    selected.value.type !== 'free'
  )
})
const changedEmail = computed(() => props.type === 'accountPlan' && props.subscriberData?.email !== email.value)
const isLoading = computed(() => {
  return unref(isSubscriptionLoading) || isPaymentLoading.value
})
function updateSubscriber() {
  emit('apply', {
    type: 'update',
    input: {
      first_name: firstName.value,
      last_name: lastName.value,
      ...(changedEmail.value ? { email: email.value } : null),
    },
  })
}
function createSubscription() {
  emit('apply', {
    type: 'create',
    plan: selected.value,
    input: {
      first_name: firstName.value,
      last_name: lastName.value,
      ...(changedEmail.value ? { email: email.value } : null),
    },
  })
}
function changeSubscription() {
  emit('apply', {
    type: 'change',
    plan: selected.value,
    input: {
      first_name: firstName.value,
      last_name: lastName.value,
      ...(changedEmail.value ? { email: email.value } : null),
    },
  })
}
function cancelSubscription() {
  emit('apply', {
    type: 'cancel',
    plan: selected.value,
    input: {
      first_name: firstName.value,
      last_name: lastName.value,
      ...(changedEmail.value ? { email: email.value } : null),
    },
  })
}

async function onSubmit() {
  if (isPaymentLoading.value) {
    return
  }

  if (showBillingInput.value) {
    const checkPaymentStatus = await confirmPayment()
    if (!checkPaymentStatus) {
      return
    }
  }

  if (!props.siteData?.subscription) {
    updateSubscriber()
  } else {
    if (selected.value.type === 'free') {
      if (props.subscriberData?.subscription_type !== 'free') {
        cancelSubscription()
      } else {
        updateSubscriber()
      }
    } else {
      if (selected.value.type === props.subscriberData?.subscription?.interval) {
        updateSubscriber()
        return
      }
      if (props.subscriberData?.subscription_type === 'free') {
        createSubscription()
      } else {
        changeSubscription()
      }
    }
  }
}
</script>

<template>
  <div class="flex-auto" v-bind="$attrs">
    <!-- choose a paid plan -->
    <RadioGroup v-if="siteData?.subscription" v-model="selected" class="mb-4 grid grid-cols-3 gap-x-1.5 md:gap-x-[9px]">
      <RadioGroupOption v-for="plan in plans" :key="plan.type" v-slot="{ checked }" :value="plan">
        <Button :text="plan.name" rounded :primary="checked" class="w-full" />
      </RadioGroupOption>
    </RadioGroup>
    <!-- signup name input -->
    <div class="mb-4 grid grid-cols-2 gap-x-2 gap-y-3 md:gap-x-3">
      <input
        v-if="type === 'accountPlan'"
        v-model="email"
        type="email"
        placeholder="Email"
        class="text-inputs col-[1/-1] h-12 border border-zinc-700 bg-transparent px-4 py-3"
      />
      <input
        v-model="firstName"
        type="text"
        placeholder="First name"
        class="text-inputs h-12 border border-zinc-700 bg-transparent px-4 py-3"
      />
      <input
        v-model="lastName"
        type="text"
        placeholder="Last name"
        class="text-inputs h-12 border border-zinc-700 bg-transparent px-4 py-3"
      />
    </div>
    <!-- if choose a paid plan, show card number input  -->
    <div v-if="showBillingInput" class="mb-4">
      <div ref="reference" class="text-inputs" />
    </div>

    <div class="text-xs text-zinc-700">
      {{ siteData?.name }} uses Storipress for membership. By registering you agree to Storipress’
      <u><a target="_blank" rel="noreferrer noopener" href="https://storipress.com/legal/terms">Terms</a></u>
      and
      <u>
        <a target="_blank" rel="noreferrer noopener" href="https://storipress.com/legal/global-privacy-policy">
          Privacy Policy
        </a>
      </u>
      .
    </div>
  </div>
  <Button
    :disabled="isLoading"
    :is-loading="isLoading"
    :text="button"
    primary
    rounded
    class="mt-12 w-full"
    @click="onSubmit"
  />
</template>
