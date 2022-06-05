<script lang="ts" setup>
import { computed } from 'vue'
import { useVModel, whenever } from '@vueuse/core'
import { Modal } from './components'
import { modalTexts } from './modal-text'

const props = defineProps<{
  dialogType: string
  logo: string
  email?: string | undefined
  modelValue: boolean
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
}>()

const modalVisible = useVModel(props, 'modelValue', emit)
const texts = computed(() => {
  const { dialogType } = props
  const text = modalTexts[dialogType]
  if (!text) {
    return null
  }

  return {
    ...text,
    sub: text.sub.replace('__EMAIL__', props.email || ''),
  }
})

// When the modal is visible but we don't have a dialog type, we need to hide it
whenever(
  () => props.modelValue,
  () => {
    if (texts.value) {
      return
    }
    emit('update:modelValue', false)
  }
)
</script>

<template>
  <Modal
    v-if="texts"
    v-model="modalVisible"
    class="pointer-events-auto"
    :logo="logo"
    :title="texts.title"
    :sub="texts.sub"
    :button="texts.button"
    @click="modalVisible = false"
  />
</template>
