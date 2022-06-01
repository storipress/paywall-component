<script setup lang="ts">
import { Button } from '../../index'

defineProps({
  button: {
    type: String,
    default: '',
  },
})
const emit = defineEmits<{
  (event: 'apply', handler: any): void
}>()

const email = ref('')
</script>

<template>
  <div class="flex-auto" v-bind="$attrs">
    <Button primary rounded color-hex="#ffffff" class="layer-1 mb-6 w-full">
      <template #buttonText>
        <i class="icon-email text-2xl text-zinc-700" />
        <span class="text-button w-full pr-6 text-zinc-700">Log in with Email</span>
      </template>
    </Button>

    <input
      v-model="email"
      type="text"
      placeholder="Email address"
      class="text-inputs h-12 w-full border border-zinc-700 bg-transparent px-4 py-3"
    />
  </div>

  <Button :text="button" primary rounded class="mt-32 w-full" @click="emit('apply', { email })" />
</template>

<style scoped></style>
