<script lang="ts" setup>
import { computed } from 'vue'
import { useVModel, whenever } from '@vueuse/core'
import twitterLogo from '../assets/icons-twitter.svg'
import { Button, Modal } from './components'
import { modalTexts } from './modal-text'

const props = defineProps<{
  dialogType: string
  logo: string
  publicationName?: string | undefined
  email?: string | undefined
  modelValue: boolean
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'confirm'): void
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
    sub: text.sub.replace('__EMAIL__', props.email || '').replace('__PUBLICATION_NAME__', props.publicationName || ''),
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
const confirm = () => {
  modalVisible.value = false
  emit('confirm')
}
const shareToTwitter = () => {
  window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(location.origin)}`, '_blank', 'noopener')
  modalVisible.value = false
}
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
    @click="confirm"
  >
    <template v-if="dialogType === 'shareToTwitter'" #button>
      <div class="mt-[1.7rem] flex flex-col items-center">
        <Button
          primary
          rounded
          color-hex="#55acee"
          class="mb-[0.56rem] mb-2 h-8 min-h-[2rem] w-[5.1rem]"
          @click="shareToTwitter"
        >
          <template #buttonText>
            <img :src="twitterLogo" class="mr-1 w-4" />
            <span class="text-caption w-full pr-6 font-bold text-white">Tweet</span>
          </template>
        </Button>
        <button class="text-caption font-bold text-black/50" @click="modalVisible = false">
          <u>Maybe later</u>
        </button>
      </div>
    </template>
  </Modal>
</template>
