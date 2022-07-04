<script setup lang="ts">
import { Button, ListItem, Toggle } from '../../index'

const props = defineProps({
  type: {
    type: String,
  },
  siteData: {
    type: Object,
  },
  subscriberData: {
    type: Object,
  },
})
const emit = defineEmits<{
  (event: 'changeDialogType', type: string): void
  (event: 'signOut'): void
  (event: 'apply', handler: any): void
}>()

const subscriptionPlan = computed(() => {
  const { interval = '', price = '' } = props.subscriberData?.subscription ?? {}
  return props.subscriberData?.subscription && `$${price}/${interval}`
})

const subscriberCardInfo = computed(() => {
  return props.subscriberData?.card_last_four && `**** **** **** ${props.subscriberData?.card_last_four}`
})

const newsletterStatus = computed(() => {
  return props.subscriberData?.newsletter ? 'Subscribed' : 'Unsubscribed'
})
const isPaidPlan = computed(() => {
  return props.type === 'paidAccound'
})

const onChangeDialogType = () => {
  emit('changeDialogType', 'accountPlan')
}
</script>

<template>
  <div class="flex-auto" v-bind="$attrs">
    <Button
      v-if="!isPaidPlan"
      text="View plans"
      primary
      class="mb-4 w-full text-lg font-semibold"
      @click="onChangeDialogType"
    />

    <ul class="layer-1 w-full rounded-sm bg-white">
      <ListItem
        :title="subscriberData?.full_name"
        :info="subscriberData?.email"
        button-text="Edit"
        class="border-b border-[#e3e3e3]"
        @click="onChangeDialogType"
      />
      <template v-if="isPaidPlan">
        <ListItem
          title="Plan"
          :info="subscriptionPlan"
          button-text="Change"
          class="border-b border-[#e3e3e3]"
          @click="onChangeDialogType"
        />
        <ListItem
          title="Billing Info"
          :info="subscriberCardInfo"
          button-text="Update"
          class="border-b border-[#e3e3e3]"
          @click="onChangeDialogType"
        />
      </template>
      <ListItem title="Email Newsletter" :info="newsletterStatus">
        <template #itemRight>
          <Toggle
            :checked="subscriberData?.newsletter"
            type="simple"
            color="bg-green-600"
            @click="emit('apply', { input: { newsletter: !subscriberData?.newsletter } })"
          />
        </template>
      </ListItem>
    </ul>
  </div>

  <div class="mt-12 flex justify-between">
    <Button text="Sign out" rounded @click="emit('signOut')" />
    <Button primary rounded>
      <template #buttonText>
        <!-- TODO api site.email -->
        <a :href="`mailto:#${siteData?.email}`" class="flex h-full items-center">Contact Support</a>
      </template>
    </Button>
  </div>
</template>

<style scoped></style>
