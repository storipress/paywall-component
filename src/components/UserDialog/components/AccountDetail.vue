<script setup lang="ts">
import { RadioGroup, RadioGroupOption } from '@headlessui/vue'
import { Button } from '../../index'
import { useStripe } from '../../../composables'
import type { UserDialogParams } from '../definition'

interface TProps {
  type?: string
  button?: string
  siteData?: {
    name: string
    email: string
    subscription: boolean
    monthly_price: string
    yearly_price: string
    monthly_price_id: string
    yearly_price_id: string
  }
  subscriberData?: {
    first_name: string
    last_name: string
    subscription: { interval: string; price: string }
    subscription_type: string
  }
  auth?: string
}
const props = withDefaults(defineProps<TProps>(), {
  button: '',
  useSlideOver: true,
})

const emit = defineEmits<{
  (event: 'apply', params: UserDialogParams): void
}>()

const { reference, confirmPayment, isLoading } = useStripe()

const plans = computed(() => {
  if (props.siteData?.subscription) {
    return [
      { name: 'Free', type: 'free' },
      {
        name: `$${props.siteData?.monthly_price}/Month`,
        type: 'monthly',
        priceId: props.siteData.monthly_price_id,
      },
      {
        name: `$${props.siteData?.yearly_price}/Year`,
        type: 'yearly',
        priceId: props.siteData.yearly_price_id,
      },
    ]
  }
  return []
})

const userPlan = computed(() => {
  if (props.auth) {
    if (props.type === 'accountPlan') {
      const index = plans.value?.findIndex((plan) => plan.type === props.subscriberData?.subscription?.price)
      return props.subscriberData?.subscription_type === 'subscribed' ? index : 0
    } else {
      return props.type === 'signupFree' ? 0 : 1
    }
  } else {
    return 0
  }
})

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

const updateSubscriber = () => {
  emit('apply', {
    type: 'update',
    input: {
      first_name: firstName.value,
      last_name: lastName.value,
    },
  })
}
const createSubscription = () => {
  emit('apply', {
    type: 'create',
    plan: selected.value,
    input: {
      first_name: firstName.value,
      last_name: lastName.value,
    },
  })
}
const changeSubscription = () => {
  emit('apply', {
    type: 'change',
    plan: selected.value,
    input: {
      first_name: firstName.value,
      last_name: lastName.value,
    },
  })
}
const cancelSubscription = () => {
  emit('apply', {
    type: 'cancel',
    plan: selected.value,
    input: {
      first_name: firstName.value,
      last_name: lastName.value,
    },
  })
}

const onSubmit = async () => {
  if (isLoading.value) {
    return
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
      const checkPaymentStatus = await confirmPayment()

      if (checkPaymentStatus) {
        if (props.subscriberData?.subscription_type === 'free') {
          createSubscription()
        } else {
          changeSubscription()
        }
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
    <div class="mb-4 grid grid-cols-2 gap-x-2 md:gap-x-3">
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
    <div v-if="siteData?.subscription && selected?.type !== 'free'" class="mb-4">
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
  <Button :disabled="isLoading" :text="button" primary rounded class="mt-12 w-full" @click="onSubmit" />
</template>
