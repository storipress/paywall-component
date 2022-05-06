<script setup lang="ts">
import { noop } from 'lodash-es'
import { SlideOver } from '../index'
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
  useSlideOver: {
    type: Boolean,
    default: true,
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
  <component :is="useSlideOver ? SlideOver : 'div'" v-slot="receiveProps" v-bind="$attrs">
    <div class="layer-3 relative flex h-full w-full flex-col rounded-l-2xl bg-zinc-50 md:w-[28.125rem]">
      <div
        class="hidden h-[15.75rem] w-full rounded-tl-2xl bg-cover p-6 md:block"
        :style="`background-image:url('${backgroundImage}')`"
      />
      <div class="flex w-full justify-between px-6 pt-6 md:absolute md:top-0">
        <img :src="logo" class="max-h-8" />
        <button
          class="icon-cross_thin ease-in-out' focus-none h-fit text-black/30 transition duration-100 md:text-white/30 md:hover:text-white"
          @click="receiveProps?.onCloseDialog ? receiveProps.onCloseDialog() : noop()"
        />
      </div>

      <div class="mt-8 flex flex-auto flex-col overflow-scroll rounded-bl-2xl px-6 pb-6">
        <div class="mb-8 text-zinc-700">
          <div class="text-display-x-large mb-4 font-black">{{ currentData.title }}</div>
          <div class="text-heading">{{ currentData.sub }}</div>
        </div>
        <slot />
      </div>
    </div>
  </component>
</template>

<style scoped></style>
