<script setup lang="ts">
import { Button } from '../../index'

const props = withDefaults(defineProps<{ type: string; button?: string }>(), {
  button: '',
  useSlideOver: true,
})

const emit = defineEmits<{
  (event: 'changeDialogType', type: string): void
  (event: 'apply'): void
}>()

function onClick() {
  if (props.type === 'confirmation') {
    emit('changeDialogType', 'accountPlan')
  } else {
    emit('apply')
  }
}
</script>

<template>
  <div class="flex-auto" v-bind="$attrs" />
  <Button :text="button" primary rounded class="mt-12 w-full" @click="onClick" />
</template>
