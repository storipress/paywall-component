<script setup lang="ts">
import { Button, ListItem, Toggle } from '../../index'

// TODO api subscriber.subscribed
const props = defineProps({
  type: {
    type: String,
  },
})
const emit = defineEmits<{
  (event: 'changeDialogType', type: string): void
}>()

// TODO api subscriber
const subscriber = {
  full_name: 'Alex Pan',
  email: 'alex@storipress.com',
  plan: '$15.00/month',
  billing: '**** **** **** 4242',
}

const newsletter = ref(false) // TODO api subscriber.newsletter
const onSwitch = () => {
  newsletter.value = !newsletter.value
}

const newsletterStatus = computed(() => {
  return newsletter.value ? 'Subscribed' : 'Unsubscribed'
})
const isPaidPlan = computed(() => {
  return props.type === 'paidAccound'
})

const onChangeDialogType = () => {
  emit('changeDialogType', 'accountPlan')
}
</script>

<template>
  <div class="flex-auto">
    <Button
      v-if="!isPaidPlan"
      text="View plans"
      primary
      class="w-full mb-4 text-lg font-semibold"
      @click="onChangeDialogType"
    />

    <ul class="layer-1 w-full bg-white rounded-sm">
      <ListItem
        :title="subscriber.full_name"
        :info="subscriber.email"
        button-text="Edit"
        class="border-b border-[#e3e3e3]"
        @click="onChangeDialogType"
      />
      <template v-if="isPaidPlan">
        <ListItem
          title="Plan"
          :info="subscriber.plan"
          button-text="Change"
          class="border-b border-[#e3e3e3]"
          @click="onChangeDialogType"
        />
        <ListItem
          title="Billing Info"
          :info="subscriber.billing"
          button-text="Update"
          class="border-b border-[#e3e3e3]"
          @click="onChangeDialogType"
        />
      </template>
      <ListItem title="Email Newsletter" :info="newsletterStatus">
        <template #itemRight>
          <Toggle :checked="newsletter" type="simple" color="bg-green-600" @click="onSwitch" />
        </template>
      </ListItem>
    </ul>
  </div>

  <div class="flex justify-between mt-12">
    <Button text="Sign out" rounded />
    <Button primary rounded>
      <template #buttonText>
        <!-- TODO api site.email -->
        <a href="mailto:#" class="flex items-center h-full">Contact Support</a>
      </template>
    </Button>
  </div>
</template>

<style scoped></style>
