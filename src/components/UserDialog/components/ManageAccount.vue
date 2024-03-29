<script setup lang="ts">
import { computed } from 'vue'
import type { PropType } from 'vue'
import { Button, ListItem, Toggle } from '../../index'
import type { UserDialogParams, UserDialogType } from '../definition'

const props = defineProps({
  type: {
    type: String as PropType<UserDialogType>,
  },
  siteData: {
    type: Object,
  },
  subscriberData: {
    type: Object,
  },
})
const emit = defineEmits<{
  (event: 'changeDialogType', type: UserDialogType, showBilling: boolean): void
  (event: 'apply', params: UserDialogParams, showDialog?: boolean): void
}>()

function addDecimal(text?: string | number | null) {
  if (Number.isNaN(Number(text))) return '0.00'
  if (typeof text === 'number' || /\d+\.\d+/.test(String(text))) {
    text = Number(text).toFixed(2)
  }
  return Number(`${text ?? 0}`.replace(/\B(?=\d{2}$)/, '.'))
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const subscriptionPlan = computed(() => {
  const { interval = '', price = '' } = props.subscriberData?.subscription ?? {}
  return props.subscriberData?.subscription && `$${addDecimal(price)}/${interval}`
})

const subscriberCardInfo = computed(() => {
  return props.subscriberData?.pm_last_four && `**** **** **** ${props.subscriberData?.pm_last_four}`
})

const newsletterStatus = computed(() => {
  return props.subscriberData?.newsletter ? 'Subscribed' : 'Unsubscribed'
})
const isPaidPlan = computed(() => {
  return props.type === 'paidAccount'
})

async function onClickSignOut() {
  emit('apply', { type: 'logout' })
}

function onChangeDialogType(showBilling = false) {
  emit('changeDialogType', 'accountPlan', showBilling)
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
          @click="onChangeDialogType(true)"
        />
      </template>
      <ListItem title="Email Newsletter" :info="newsletterStatus">
        <template #itemRight>
          <Toggle
            :checked="subscriberData?.newsletter"
            type="simple"
            color="bg-green-600"
            @click="emit('apply', { type: 'update', input: { newsletter: !subscriberData?.newsletter } }, true)"
          />
        </template>
      </ListItem>
    </ul>
  </div>

  <div class="mt-12 flex justify-between">
    <Button text="Sign out" rounded @click="onClickSignOut" />
    <Button primary rounded>
      <template #buttonText>
        <a :href="`mailto:${siteData?.email}`" class="flex h-full items-center">Contact Support</a>
      </template>
    </Button>
  </div>
</template>

<style scoped></style>
