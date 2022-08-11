<script setup lang="ts">
import SpinnerIcon from './SpinnerIcon.vue'

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
  isLoading: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits<{
  (event: 'click'): void
}>()

const onClick = () => {
  if (!props.disabled) {
    emit('click')
  }
}

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
    class="text-button inline-flex h-12 min-h-[3rem] items-center justify-center border bg-white/25 px-5 font-medium text-zinc-50"
    :class="[{ 'cursor-not-allowed': disabled }, isRounded]"
    @click="onClick"
  >
    <SpinnerIcon v-if="isLoading" class="h-5 w-5 animate-spin" />
    <slot v-else name="buttonText">
      {{ text }}
    </slot>
  </button>
</template>

<style scoped></style>
