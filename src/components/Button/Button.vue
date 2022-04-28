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
const emit = defineEmits<{
  (event: 'click'): void
}>()

const onClick = () => {
  emit('click')
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
    :class="isRounded"
    class="text-button inline-flex h-12 min-h-[3rem] items-center justify-center border bg-white/25 px-5 font-medium text-zinc-50"
    @click="onClick"
  >
    <slot name="buttonText">
      {{ text }}
    </slot>
  </button>
</template>

<style scoped></style>
