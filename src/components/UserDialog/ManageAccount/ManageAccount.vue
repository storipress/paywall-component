<script setup lang="ts">
import UserDialog from '../UserDialog.vue'
import { Button, ListItem, Toggle } from '../../index'
import spLogo from '../../../../assets/sp-logo-white.svg'

// TODO api subscriber.subscribed
const props = defineProps({
  isPaidPlan: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
  },
})

const newsletter = ref(false) // TODO api subscriber.newsletter
const onSwitch = () => {
  newsletter.value = !newsletter.value
}

const newsletterStatus = computed(() => {
  return newsletter.value ? 'Subscribed' : 'Unsubscribed'
})
</script>

<template>
  <UserDialog :type="type" :logo="spLogo">
    <Button v-if="!isPaidPlan" text="View plans" primary class="w-full mb-4 text-lg font-semibold" />

    <ul class="layer-1 w-full bg-white rounded-sm">
      <ListItem title="Alex Pan" info="alex@storipress.com" button-text="Edit" class="border-b border-[#e3e3e3]" />
      <template v-if="isPaidPlan">
        <ListItem title="Plan" info="$15.00/month" button-text="Change" class="border-b border-[#e3e3e3]" />
        <ListItem
          title="Billing Info"
          info="**** **** **** 4242"
          button-text="Update"
          class="border-b border-[#e3e3e3]"
        />
      </template>
      <ListItem title="Email Newsletter" :info="newsletterStatus">
        <template #itemRight>
          <Toggle :checked="newsletter" type="simple" color="bg-green-600" @click="onSwitch" />
        </template>
      </ListItem>
    </ul>

    <div class="mt-[7.625rem] flex justify-between">
      <Button text="Sign out" rounded />
      <Button text="Contact Support" primary rounded />
    </div>
  </UserDialog>
</template>

<style scoped></style>
