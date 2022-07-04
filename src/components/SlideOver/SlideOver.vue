<script setup lang="ts">
import { Dialog, DialogOverlay, TransitionChild, TransitionRoot } from '@headlessui/vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
}>()

const visible = useVModel(props, 'modelValue', emit)

const onCloseDialog = () => {
  visible.value = false
}
</script>

<template>
  <TransitionRoot as="template" :show="visible">
    <Dialog as="div" class="fixed inset-0 overflow-hidden" @close="onCloseDialog">
      <div class="absolute inset-0 overflow-hidden">
        <TransitionChild
          as="template"
          enter="ease-in-out duration-500"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in-out duration-500"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <DialogOverlay class="absolute inset-0 bg-zinc-800/50 backdrop-blur-[10px]" />
        </TransitionChild>

        <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full">
          <TransitionChild
            as="template"
            enter="transform transition ease-in-out duration-500 sm:duration-700"
            enter-from="translate-x-full"
            enter-to="translate-x-0"
            leave="transform transition ease-in-out duration-500 sm:duration-700"
            leave-from="translate-x-0"
            leave-to="translate-x-full"
          >
            <div class="pointer-events-auto">
              <slot :on-close-dialog="onCloseDialog" />
            </div>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<style scoped></style>
