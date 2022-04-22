<script setup lang="ts">
const props = defineProps({
  text: {
    type: String,
    default: '',
  },
  colorHex: {
    type: String,
    default: '#262626',
  },
  rounded: {
    type: Boolean,
    default: false,
  },
  primary: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const isPrimary = computed(() => {
  return props.primary
    ? { 'background-color': props.colorHex, 'border-color': props.colorHex }
    : { 'border-color': props.colorHex, color: props.colorHex }
})
const isRounded = computed(() => {
  return { rounded: props.rounded }
})
</script>

<template>
  <button
    :disables="disabled"
    :style="isPrimary"
    :class="isRounded"
    class="bg-white/25 text-zinc-50 inline-flex items-center justify-center h-12 px-5 text-lg font-medium border"
  >
    {{ text }}
  </button>
</template>

<style scoped></style>
