<script setup lang="ts">
import { Button } from '../../index'

withDefaults(defineProps<{ button?: string }>(), {
  button: '',
  useSlideOver: true,
})

defineEmits(['apply'])
</script>

<template>
  <div class="flex-auto" v-bind="$attrs" />
  <Button :text="button" primary rounded class="mt-12 w-full" @click="$emit('apply')" />
</template>
