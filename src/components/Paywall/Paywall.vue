<script setup lang="ts">
import { Button } from '../index'
import { data } from './data'

const props = defineProps({
  type: {
    type: String,
    default: '',
  },
  publicationName: {
    type: String,
    default: '',
  },
})
const emit = defineEmits<{
  (event: 'click', val: string): void
  (event: 'clickSignIn'): void
}>()

const email = ref('')

const currentData = computed(() => {
  const current = data[props.type]
  return {
    title: current.title.replace('__PUBLICATION_NAME__', props.publicationName),
    sub: current.sub.replace('__PUBLICATION_NAME__', props.publicationName),
    button: current.button,
  }
})

const isUpgrade = computed(() => {
  return props.type === 'upgrade'
})
</script>

<template>
  <div class="flex justify-center">
    <div
      class="layer-2 fixed bottom-9 w-full overflow-scroll rounded-t-2xl bg-zinc-50 px-6 py-5 md:h-fit md:w-[70vw] md:min-w-[45rem] md:max-w-[60rem] md:rounded-2xl md:py-8 md:px-10"
    >
      <div class="mb-4 text-zinc-700 md:mr-4 md:mb-11">
        <div class="text-display-large font-black md:text-[2.625rem] md:leading-[1.05]" v-html="currentData.title" />
        <div class="text-heading mt-4 hidden md:block">{{ currentData.sub }}</div>
      </div>

      <div class="flex w-full flex-col">
        <div class="md:flex">
          <input
            v-if="!isUpgrade"
            v-model="email"
            type="email"
            placeholder="Email Address"
            class="text-inputs layer-1 mb-3 h-12 w-full bg-transparent px-4 pt-3.5 pb-[0.8rem] text-zinc-500 md:mb-0 md:mr-[1.125rem] md:max-w-[47.6%]"
            @keydown.enter="emit('click', email)"
          />
          <Button
            :text="currentData.button"
            primary
            class="w-full text-lg font-semibold"
            :class="isUpgrade ? 'md:w-[16.125rem]' : 'md:w-[7.5rem]'"
            @click="emit('click', email)"
          />
        </div>
        <div v-if="!isUpgrade" class="mt-1.5 text-xs text-zinc-600 md:mt-2.5">
          Already have an account? <button @click="emit('clickSignIn')"><u>Sign in</u></button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
