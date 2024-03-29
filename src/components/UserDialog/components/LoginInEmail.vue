<script setup lang="ts">
import { ErrorMessage as VeeErrorMessage, Field as VeeField, Form as VeeForm } from 'vee-validate'
import { object as yupObject, string as yupString } from 'yup'
import { Button } from '../../index'
import type { UserDialogParams } from '../definition'
import { Email } from '../../Icons'

defineProps({
  button: {
    type: String,
    default: '',
  },
})
const emit = defineEmits<{
  (event: 'apply', params: UserDialogParams): void
}>()

const schema = yupObject().shape({
  email: yupString().email().required(),
})

const onSubmit = function (formData: any, submitEvent: any) {
  submitEvent?.evt.preventDefault()
  emit('apply', {
    type: 'login',
    email: formData.email,
  })
}
</script>

<template>
  <VeeForm class="flex flex-auto flex-col" :validation-schema="schema" @submit="onSubmit">
    <div class="flex-auto">
      <div class="relative" v-bind="$attrs">
        <Button primary rounded color-hex="#ffffff" class="layer-1 mb-6 hidden w-full" type="button">
          <template #buttonText>
            <Email class="h-6 w-6 text-zinc-700" />
            <span class="text-button w-full pr-6 text-zinc-700">Log in with Email</span>
          </template>
        </Button>
        <VeeField
          name="email"
          type="email"
          placeholder="Email address"
          class="text-inputs h-12 w-full border border-zinc-700 bg-transparent px-4 py-3"
          @keyup.enter="onSubmit"
        />
        <VeeErrorMessage as="div" name="email" class="text-caption absolute bottom-[calc(-1.5_*_1em)] text-red-700" />
      </div>
    </div>

    <Button :text="button" primary rounded class="mt-32 w-full" type="submit" />
  </VeeForm>
</template>

<style scoped></style>
