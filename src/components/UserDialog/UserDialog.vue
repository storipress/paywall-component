<script setup lang="ts">
import { noop } from 'lodash-es'
import { SlideOver } from '../index'
import defaultBackground from '../../../assets/subs-default.png'
import { AccountDetail, LoginInEmail, LoginInSocial, ManageAccount } from './components/index'
import { data } from './data'

const props = defineProps({
  type: {
    type: String,
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
  auth: {
    type: String,
  },
})
const emit = defineEmits<{
  (event: 'applyHandler', result: any): void
  (event: 'signOut'): void
}>()

const currentType = ref('')
const type = toRef(props, 'type')
const result = computed<Record<string, string>>(() => ({
  __PAID_PLAN__: props.subscriberData?.subscription?.interval ?? '',
  __RENEWS_DATE__: props.subscriberData?.subscription?.renew_on ?? '',
  __PUBLICATION_NAME__: props.siteData?.name ?? '',
}))

watch(
  type,
  (type) => {
    currentType.value = type
  },
  { immediate: true }
)

const dialogMap: Record<string, unknown> = {
  welcome: LoginInEmail,
  welcomeInSocial: LoginInSocial,
  accountPlan: AccountDetail,
  signupFree: AccountDetail,
  signupPremium: AccountDetail,
  upgradeAccount: AccountDetail,
  freeAccount: ManageAccount,
  paidAccound: ManageAccount,
  subscribe: AccountDetail,
}

const dialogType = computed(() => dialogMap[currentType.value])

const currentData = computed(() => {
  const current = data[currentType.value]
  return {
    title: current.title,
    sub: current.sub.replace(/\b(__PAID_PLAN__|__RENEWS_DATE__|__PUBLICATION_NAME__)\b/g, (match) => {
      return result.value[match]
    }),
    button: current.button,
  }
})

const onChangeDialogType = (type: string) => {
  currentType.value = type
}

function handleApply(params: any) {
  emit('applyHandler', params)
}
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
          class="icon-cross_thin ease-in-out' focus-none h-fit text-black/30 transition duration-100 md:text-white/30 md:hover:text-white"
          @click="receiveProps?.onCloseDialog ? receiveProps.onCloseDialog() : noop()"
        />
      </div>

      <div class="mt-8 flex flex-auto flex-col overflow-auto rounded-bl-2xl px-6 pb-6">
        <div class="mb-8 text-zinc-700">
          <div class="text-display-x-large mb-4 font-black">{{ currentData.title }}</div>
          <div class="text-heading" v-html="currentData.sub" />
        </div>
        <slot>
          <component
            :is="dialogType"
            v-bind="{ type, siteData, subscriberData, auth, button: currentData.button }"
            @change-dialog-type="onChangeDialogType"
            @apply="handleApply"
            @sign-out="emit('signOut')"
          />
        </slot>
      </div>
    </div>
  </component>
</template>

<style scoped></style>
