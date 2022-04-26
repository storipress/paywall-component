<script setup lang="ts">
import defaultBackground from '../../../assets/subs-default.png'
import { data } from './data'

const props = defineProps({
  type: {
    type: String,
    default: '',
  },
  logo: {
    type: String,
    default: '',
  },
  backgroundImage: {
    type: String,
    default: defaultBackground,
  },
})

const publicationName = 'Storipress' // TODO api
const subscriptionType = 'monthly' // TODO api
const subscriberRenew = '2022-05-20' // TODO api subscriber.renew_on
const result: Record<string, string> = {
  __PAID_PLAN__: subscriptionType,
  __RENEWS_DATE__: subscriberRenew,
  __PUBLICATION_NAME__: publicationName,
}

const currentData = computed(() => {
  const current = data[props.type]
  return {
    title: current.title,
    sub: current.sub.replace(/\b(__PAID_PLAN__|__RENEWS_DATE__|__PUBLICATION_NAME__)\b/g, (match) => {
      return result[match]
    }),
  }
})
</script>

<template>
  <div class="layer-3 h-full w-[28.125rem] rounded-l-2xl">
    <div
      class="flex h-[15.75rem] justify-between rounded-tl-2xl bg-cover p-6"
      :style="`background-image:url('${backgroundImage}')`"
    >
      <img :src="logo" class="max-h-8" />
      <button class="icon-cross_thin ease-in-out' h-fit text-white/30 transition duration-75 hover:text-white" />
    </div>

    <div class="rounded-bl-2xl bg-zinc-50 p-6 pt-8">
      <div class="text-zinc-700 mb-8">
        <div class="text-display-x-large mb-4 font-black">{{ currentData.title }}</div>
        <div class="text-heading">{{ currentData.sub }}</div>
      </div>
      <slot />
    </div>
  </div>
</template>

<style scoped></style>
