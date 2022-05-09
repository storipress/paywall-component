<script setup lang="ts">
import { RadioGroup, RadioGroupOption } from '@headlessui/vue'
import { Button } from '../../index'
import { useStripe } from '../../../composables'

interface TProps {
  type?: string
  button?: string
  siteData?: { name: string; email: string; subscription: boolean; monthly_price: string; yearly_price: string }
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
  (event: 'apply', handler: any): void
}>()

const { reference } = useStripe()

const plans = computed(() => {
  if (props.siteData?.subscription) {
    return [
      { planName: 'Free', value: 'free' },
      { planName: `$${props.siteData?.monthly_price}/Month`, value: props.siteData?.monthly_price },
      { planName: `$${props.siteData?.yearly_price}/Year`, value: props.siteData?.yearly_price },
    ]
  }
  return []
})

const isPaidPlan = computed(() => {
  if (props.auth) {
    const index = plans.value?.findIndex((plan) => plan.value === props.subscriberData?.subscription?.price)
    return props.subscriberData?.subscription_type === 'subscribed' ? index : 0
  } else {
    return props.type !== 'signupFree' ? 1 : 0
  }
})

const first_name = toRef(props, 'subscriberData').value?.first_name
const last_name = toRef(props, 'subscriberData').value?.last_name
const selected = ref(plans.value[isPaidPlan.value])
</script>
<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <div class="flex-auto">
    <!-- choose a paid plan -->
    <RadioGroup v-if="siteData?.subscription" v-model="selected" class="mb-4 grid grid-cols-3 gap-x-1.5 md:gap-x-[9px]">
      <RadioGroupOption v-for="plan in plans" :key="plan.value" v-slot="{ checked }" :value="plan">
        <Button :text="plan.planName" rounded :primary="checked" class="w-full" />
      </RadioGroupOption>
    </RadioGroup>
    <!-- signup name input -->
    <div class="gap-x-2 md:gap-x-3 grid grid-cols-2 mb-4">
      <input
        v-model="first_name"
        type="text"
        placeholder="First name"
        class="text-inputs border-zinc-700 h-12 px-4 py-3 bg-transparent border"
      />
      <input
        v-model="last_name"
        type="text"
        placeholder="Last name"
        class="text-inputs border-zinc-700 h-12 px-4 py-3 bg-transparent border"
      />
    </div>
    <!-- if choose a paid plan, show card number input  -->
    <div v-if="siteData?.subscription && selected?.value !== 'free'" class="mb-4">
      <div ref="reference" class="text-inputs border-zinc-700 grid items-center h-12 px-4 py-3 bg-transparent border" />
    </div>

    <div class="text-zinc-700 text-xs">
      {{ siteData?.name }} uses Storipress for membership. By registering you agree to Storipress’
      <u><a href="#">Terms</a></u>
      and
      <u><a href="#">Privacy Policy</a></u
      >.
    </div>
  </div>

  <Button
    :text="button"
    primary
    rounded
    class="w-full mt-12"
    @click="
      emit('apply', {
        input: {
          first_name: first_name,
          last_name: last_name,
          selected,
        },
      })
    "
  />
</template>

<style scoped></style>
