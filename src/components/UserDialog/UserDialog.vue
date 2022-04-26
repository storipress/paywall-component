<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  logo: {
    type: String,
    default: '',
  },
  backgroundImage: {
    type: String,
    default: '../../../../assets/subs-default.png',
  },
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
        <div class="text-display-x-large mb-4 font-black">{{ title }}</div>
        <div class="text-heading">{{ description }}</div>
      </div>
      <slot />
    </div>
  </div>
</template>

<style scoped></style>
