<script lang="ts" setup>
import { computed } from 'vue'
import { Switch } from '@headlessui/vue'
import { classname } from './classname'

const props = defineProps({
  type: {
    type: String,
    validator: (value: string) => {
      return ['simple', 'short'].includes(value)
    },
  },
  modelValue: {
    type: Boolean,
  },
  checked: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  color: {
    type: String,
    default: 'bg-teal-500',
  },
})
const emit = defineEmits<{
  (event: 'update:modelValue', val: boolean): void
  (event: 'click'): void
}>()

const isEnabled = computed(() => props.modelValue || props.checked)
const disabledClass = computed(() => {
  return { 'cursor-not-allowed opacity-30': props.disabled }
})
const enabledClass = computed(() => {
  return isEnabled.value ? props.color : 'bg-gray-200'
})
const translateClass = computed(() => {
  return isEnabled.value ? 'translate-x-5' : 'translate-x-0'
})

const input = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})
function onClick() {
  emit('click')
}
</script>

<template>
  <Switch
    v-model="input"
    :disabled="disabled"
    :class="[enabledClass, classname[type], disabledClass]"
    class="relative inline-flex flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none"
    @click.stop="onClick"
  >
    <span aria-hidden="true" :class="[translateClass, classname.toggleCircle]" class="bg-white mix-blend-screen">
      <i :class="{ 'icon-tick block scale-50 leading-5': isEnabled }" />
    </span>
    <!-- circle outline shadow. If placed in the same <span> due to mix-blend-screen, the circle border will cause problems above the colored background -->
    <span v-if="type === 'short'" :class="[translateClass, classname.toggleCircle]" class="layer-1" />
  </Switch>
</template>

<style lang="scss" scoped></style>
