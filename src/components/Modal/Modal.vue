<script setup lang="ts">
import { Dialog, DialogOverlay, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { Button } from '../index'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  logo: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
  sub: {
    type: String,
    default: '',
  },
  button: {
    type: String,
    default: '',
  },
})
const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'click'): void
}>()

const visible = useVModel(props, 'modelValue', emit)
</script>

<template>
  <button @click="visible = true">open</button>
  <TransitionRoot as="template" :show="visible">
    <Dialog as="div" class="fixed inset-0 z-40 overflow-y-auto" @close="visible = false">
      <div class="sm:block sm:p-0 flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <DialogOverlay class="fixed inset-0 bg-zinc-800/50 backdrop-blur-[10px]" />
        </TransitionChild>

        <span class="sm:inline-block sm:h-screen sm:align-middle hidden" aria-hidden="true">&#8203;</span>
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-to="opacity-100 translate-y-0 sm:scale-100"
          leave="ease-in duration-200"
          leave-from="opacity-100 translate-y-0 sm:scale-100"
          leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <div
            class="layer-3 relative inline-block w-[21rem] transform overflow-hidden rounded-2xl bg-white px-6 pt-8 pb-4 align-middle transition-all"
          >
            <div class="text-neutral-800">
              <!-- publication logo -->
              <img :src="logo" class="mx-auto mb-6 max-h-[1.8rem]" />
              <!-- title -->
              <div class="text-pageheading mb-4">{{ title }}</div>
              <!-- description -->
              <div class="text-body px-[1.8rem]">{{ sub }}</div>
            </div>
            <!-- button -->
            <slot name="button">
              <div class="mt-5">
                <Button :text="button" primary rounded class="w-full" @click="emit('click')" />
              </div>
            </slot>
          </div>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
