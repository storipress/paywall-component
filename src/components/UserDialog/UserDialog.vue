<script setup lang="ts">
import { noop } from 'lodash-es'
import type { Component, PropType } from 'vue'
import { SlideOver } from '../index'
import defaultBackground from '../../../assets/subs-default.png'
import type { UserDialogParams, UserDialogType } from './definition'
import { AccountDetail, LoginInEmail, LoginInSocial, ManageAccount, OnlyButton } from './components/index'
import { data } from './data'
import { CrossThin } from '~/components/Icons'

const props = defineProps({
  type: {
    type: String as PropType<UserDialogType>,
    default: '',
  },
  colorHex: {
    type: String,
    default: '#fafafa',
  },
  useSlideOver: {
    type: Boolean,
    default: true,
  },
  logo: {
    type: String,
    default: '',
  },
  backgroundImage: {
    type: String,
    default: defaultBackground,
  },
  siteData: {
    type: Object,
  },
  subscriberData: {
    type: Object,
  },
})
const emit = defineEmits<{
  (event: 'applyHandler', params: UserDialogParams): void
  (event: 'update:type', type: UserDialogType | ''): void
}>()

const result = computed<Record<string, string>>(() => ({
  __PAID_PLAN__: props.subscriberData?.subscription?.interval ?? '',
  __RENEWS_DATE__: props.subscriberData?.subscription?.renew_on ?? '',
  __PUBLICATION_NAME__: props.siteData?.name ?? '',
}))

const dialogMap: Record<UserDialogType | '', Component | undefined> = {
  welcome: LoginInEmail,
  welcomeInSocial: LoginInSocial,
  accountPlan: AccountDetail,
  signupFree: AccountDetail,
  signupPremium: AccountDetail,
  upgradeAccount: AccountDetail,
  freeAccount: ManageAccount,
  paidAccount: ManageAccount,
  subscribe: AccountDetail,
  confirmation: OnlyButton,
  shareToTwitter: undefined,
  '': undefined,
}

const dialogType = computed(() => dialogMap[props.type])

const currentData = computed(() => {
  const current = data[props.type]
  return {
    title: current.title,
    sub: current.sub.replace(/\b(__PAID_PLAN__|__RENEWS_DATE__|__PUBLICATION_NAME__)\b/g, (match) => {
      return result.value[match]
    }),
    button: current.button,
  }
})
</script>

<template>
  <component :is="useSlideOver ? SlideOver : 'div'" v-slot="receiveProps" v-bind="$attrs">
    <div
      class="layer-3 relative flex h-full w-full flex-col rounded-l-2xl md:w-[28.125rem]"
      :style="{ 'background-color': colorHex }"
    >
      <div
        class="hidden h-[15.75rem] w-full rounded-tl-2xl bg-cover p-6 md:block"
        :style="`background-image:url('${backgroundImage}')`"
      />
      <div class="flex w-full justify-between px-6 pt-6 md:absolute md:top-0">
        <img :src="logo" class="max-h-8" />
        <button
          class="focus-none h-fit text-black/30 transition duration-100 ease-in-out md:text-white/30 md:hover:text-white"
          aria-label="close"
          @click="receiveProps?.onCloseDialog ? receiveProps.onCloseDialog() : noop()"
        >
          <CrossThin class="h-4 w-4" />
        </button>
      </div>

      <div class="mt-8 flex flex-auto flex-col overflow-auto rounded-bl-2xl px-6 pb-6">
        <div class="mb-8 text-zinc-700">
          <div class="text-display-x-large mb-4 font-black">{{ currentData.title }}</div>
          <div class="text-heading" v-html="currentData.sub" />
        </div>
        <slot>
          <component
            :is="dialogType"
            v-bind="{ siteData, subscriberData, type, button: currentData.button }"
            @change-dialog-type="(type: UserDialogType | '') => emit('update:type', type)"
            @close="receiveProps.onCloseDialog()"
            @apply="(params: UserDialogParams) => emit('applyHandler', params)"
          />
        </slot>
      </div>
    </div>
  </component>
</template>

<style scoped></style>
