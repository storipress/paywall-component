<script setup lang="ts">
import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { Button } from '../../index'

const props = defineProps({
  button: {
    type: String,
    default: '',
  },
})
const emit = defineEmits<{
  (event: 'apply', result: any): void
}>()

const email = ref('')

const { mutate } = useMutation(gql`
  mutation RequestSignInSubscriber($email: Email!, $referer: String!, $from: String!) {
    requestSignInSubscriber(input: { email: $email, referer: $referer, from: $from })
  }
`)
const onLogin = async () => {
  try {
    const result = await mutate({
      email: email.value,
      referer: location.origin,
      from: document.referrer,
    })
    emit('apply', result?.data.requestSignInSubscriber)
  } catch (e) {
    console.log('e: ', e)
  }
}
</script>

<template>
  <div class="flex-auto">
    <Button primary rounded color-hex="#ffffff" class="layer-1 w-full mb-6">
      <template #buttonText>
        <i class="icon-email text-zinc-700 text-2xl" />
        <span class="text-button text-zinc-700 w-full pr-6">Log in with Email</span>
      </template>
    </Button>

    <input
      v-model="email"
      type="text"
      placeholder="Email address"
      class="text-inputs border-zinc-700 w-full h-12 px-4 py-3 bg-transparent border"
    />
  </div>

  <Button :text="button" primary rounded class="w-full mt-32" @click="onLogin" />
</template>

<style scoped></style>
