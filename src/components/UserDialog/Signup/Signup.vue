<script setup lang="ts">
import { RadioGroup, RadioGroupOption } from '@headlessui/vue'
import { Button, UserDialog } from '../../index'
import spLogo from '../../../../assets/sp-logo-white.svg'

const plans = [
  { planName: 'Free', value: '0' },
  { planName: '$5/Month', value: '5' },
  { planName: '$100/Year', value: '100' },
]
const selected = ref(plans[0])
</script>

<template>
  <UserDialog
    title="Complete 
your account."
    description="Sign up to Vice to gain access to the story."
    :logo="spLogo"
  >
    <div class="mt-8">
      <!-- choose a paid plan -->
      <RadioGroup v-model="selected" class="flex justify-between mb-4">
        <RadioGroupOption v-for="plan in plans" :key="plan.value" v-slot="{ checked }" :value="plan">
          <Button :text="plan.planName" rounded :primary="checked" class="w-32" />
        </RadioGroupOption>
      </RadioGroup>
      <!-- signup name input -->
      <div class="flex justify-between mb-4">
        <input
          type="text"
          placeholder="First name"
          class="text-inputs border-zinc-700 w-48 h-12 px-4 py-3 bg-transparent border"
        />
        <input
          type="text"
          placeholder="Last name"
          class="text-inputs border-zinc-700 w-48 h-12 px-4 py-3 bg-transparent border"
        />
      </div>
      <!-- if choose a paid plan, show card number input  -->
      <div v-if="selected.planName !== 'Free'" class="mb-4">
        <!-- WIP, card number input -->
      </div>

      <div class="text-zinc-700 text-xs">
        Vice uses Storipress for membership. By registering you agree to Storipress’ <u><a href="#">Terms</a></u> and
        <u><a href="#">Privacy Policy</a></u
        >.
      </div>
    </div>

    <Button text="Complete account" primary rounded class="mt-36 w-full" />
  </UserDialog>
</template>

<style scoped></style>
