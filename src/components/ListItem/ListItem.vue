<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: '',
  },
  info: {
    type: String,
    default: '',
  },
  buttonText: {
    type: String,
    default: '',
  },
})
const emit = defineEmits<{
  (event: 'click'): void
}>()
</script>

<template>
  <li class="flex min-h-[4.25rem] items-center justify-between px-6 py-4">
    <div class="flex flex-col">
      <span class="text-body font-bold text-neutral-800">{{ title }}</span>
      <span class="text-caption text-gray-400">{{ info }}</span>
    </div>
    <slot name="itemRight">
      <div role="button" class="text-button text-sky-600" @click="emit('click')">{{ buttonText }}</div>
    </slot>
  </li>
</template>

<style scoped></style>
