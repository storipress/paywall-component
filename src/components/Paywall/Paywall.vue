<script setup lang="ts">
import { ErrorMessage as VeeErrorMessage, Field as VeeField, Form as VeeForm } from 'vee-validate'
import { object as yupObject, string as yupString } from 'yup'
import { Button } from '../index'
import { data } from './data'

const props = defineProps({
  type: {
    type: String,
    default: '',
  },
  publicationName: {
    type: String,
    default: '',
  },
  defaultEmail: {
    type: String,
    default: '',
  },
})
const emit = defineEmits<{
  (event: 'click', val: string): void
  (event: 'clickSignIn'): void
}>()

const schema = yupObject().shape({
  email: yupString().email().required(),
})

const currentData = computed(() => {
  const current = data[props.type]
  return {
    title: current.title.replace('__PUBLICATION_NAME__', props.publicationName),
    sub: current.sub.replace('__PUBLICATION_NAME__', props.publicationName),
    button: current.button,
  }
})

const isUpgrade = computed(() => {
  return props.type === 'upgrade'
})

const onSubmit = function (formData: any, submitEvent: any) {
  submitEvent?.evt.preventDefault()
  emit('click', formData.email)
}

const emailRef = ref()
watch([() => props.defaultEmail, emailRef], () => {
  if (emailRef.value !== undefined) {
    emailRef.value.reset({ value: props.defaultEmail })
  }
})
</script>

<template>
  <div class="flex justify-center">
    <div
      class="layer-2 fixed bottom-9 w-full overflow-scroll rounded-t-2xl bg-zinc-50 px-6 py-5 md:h-fit md:w-[70vw] md:min-w-[45rem] md:max-w-[60rem] md:rounded-2xl md:py-8 md:px-10"
    >
      <div class="mb-4 text-zinc-700 md:mr-4 md:mb-11">
        <div class="text-display-large font-black md:text-[2.625rem] md:leading-[1.05]" v-html="currentData.title" />
        <div class="text-heading mt-4 hidden md:block">{{ currentData.sub }}</div>
      </div>

      <div class="flex w-full flex-col">
        <VeeForm class="md:flex" :validation-schema="schema" @submit="onSubmit">
          <div v-if="!isUpgrade" class="mb-3 w-full md:mb-0 md:mr-[1.125rem] md:max-w-[47.6%]">
            <VeeField
              ref="emailRef"
              name="email"
              type="email"
              placeholder="Email Address"
              class="text-inputs layer-1 h-12 w-full bg-transparent px-4 pt-3.5 pb-[0.8rem] text-zinc-500"
            />
            <VeeErrorMessage name="email" class="text-caption bottom-[calc(-1.5_*_1em)] text-red-700" />
          </div>
          <Button
            :text="currentData.button"
            primary
            class="w-full text-lg font-semibold"
            :class="isUpgrade ? 'md:w-[16.125rem]' : 'md:w-[7.5rem]'"
            type="submit"
          />
        </VeeForm>
        <div v-if="!isUpgrade" class="mt-1.5 text-xs text-zinc-600 md:mt-2.5">
          Already have an account? <button @click="emit('clickSignIn')"><u>Sign in</u></button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
