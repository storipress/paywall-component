<script setup lang="ts">
import { ErrorMessage as VeeErrorMessage, Field as VeeField, Form as VeeForm } from 'vee-validate'
import { object as yupObject, string as yupString } from 'yup'
import { Button } from '../../index'
import { Email } from '~/components/Icons'

defineProps({
  button: {
    type: String,
    default: '',
  },
})
const emit = defineEmits<{
  (event: 'apply', params: any): void
}>()

const schema = yupObject().shape({
  email: yupString().email().required(),
})

const onSubmit = function (formData: any, submitEvent: any) {
  submitEvent.evt.preventDefault()
  emit('apply', formData.email)
}
</script>

<template>
  <VeeForm :validation-schema="schema" @submit="onSubmit">
    <div class="relative flex-auto" v-bind="$attrs">
      <Button primary rounded color-hex="#ffffff" class="layer-1 w-full mb-6" type="button">
        <template #buttonText>
          <Email class="text-zinc-700 w-6 h-6" />
          <span class="text-button text-zinc-700 w-full pr-6">Log in with Email</span>
        </template>
      </Button>
      <VeeField
        name="email"
        type="email"
        placeholder="Email address"
        class="text-inputs border-zinc-700 w-full h-12 px-4 py-3 bg-transparent border"
        @keyup.enter="onSubmit"
      />
      <VeeErrorMessage as="div" name="email" class="text-caption absolute bottom-[calc(-1.5_*_1em)] text-red-700" />
    </div>

    <Button :text="button" primary rounded class="w-full mt-32" type="submit" />
  </VeeForm>
</template>

<style scoped></style>
