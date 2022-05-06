<script setup lang="ts">
import { RadioGroup, RadioGroupOption } from '@headlessui/vue'
import { Button } from '../../index'
import { useStripe } from '../../../composables'

const props = defineProps({
  type: {
    type: String,
  },
  button: {
    type: String,
    default: '',
  },
})

const { reference } = useStripe()

// TODO api
const plans = [
  { planName: 'Free', value: '0' },
  { planName: '$5/Month', value: '5' }, // site.monthly_price
  { planName: '$100/Year', value: '100' }, // site.yearly_price
]

const isPaidPlan = computed(() => {
  return props.type !== 'signupFree' ? 1 : 0
})
const selected = ref(plans[isPaidPlan.value])
const publicationName = 'Storipress' // TODO api
</script>

<template>
  <div class="flex-auto">
    <!-- choose a paid plan -->
    <RadioGroup v-model="selected" class="mb-4 grid grid-cols-3 gap-x-1.5 md:gap-x-[9px]">
      <RadioGroupOption v-for="plan in plans" :key="plan.value" v-slot="{ checked }" :value="plan">
        <Button :text="plan.planName" rounded :primary="checked" class="w-full" />
      </RadioGroupOption>
    </RadioGroup>
    <!-- signup name input -->
    <div class="gap-x-2 md:gap-x-3 grid grid-cols-2 mb-4">
      <input
        type="text"
        placeholder="First name"
        class="text-inputs border-zinc-700 h-12 px-4 py-3 bg-transparent border"
      />
      <input
        type="text"
        placeholder="Last name"
        class="text-inputs border-zinc-700 h-12 px-4 py-3 bg-transparent border"
      />
    </div>
    <!-- if choose a paid plan, show card number input  -->
    <div v-if="selected.planName !== 'Free'" class="mb-4">
      <div ref="reference" class="text-inputs border-zinc-700 grid items-center h-12 px-4 py-3 bg-transparent border" />
    </div>

    <div class="text-zinc-700 text-xs">
      {{ publicationName }} uses Storipress for membership. By registering you agree to Storipress’
      <u><a href="#">Terms</a></u>
      and
      <u><a href="#">Privacy Policy</a></u
      >.
    </div>
  </div>

  <Button :text="button" primary rounded class="w-full mt-12" />
</template>

<style scoped></style>
