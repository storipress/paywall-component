<script setup lang="ts">
import { Button } from '../../index'
</script>

<template>
  <div class="flex-auto">
    <Button primary rounded color-hex="#55acee" class="layer-1 mb-6 w-full">
      <template #buttonText>
        <img src="../../../../assets/icons-twitter.svg" />
        <span class="text-button w-full pr-6 text-white">Continue with Twitter</span>
      </template>
    </Button>
    <Button primary rounded color-hex="#1977f3" class="layer-1 w-full">
      <template #buttonText>
        <img src="../../../../assets/icons-facebook.svg" />
        <span class="text-button w-full pr-6 text-white">Continue with Facebook</span>
      </template>
    </Button>

    <div class="relative my-6 flex h-6 items-center justify-center">
      <span class="absolute h-px w-full bg-[#979797]" />
      <span class="absolute bg-zinc-50 px-[0.6rem] text-lg font-semibold">Or</span>
    </div>

    <Button primary rounded color-hex="#ffffff" class="layer-1 w-full">
      <template #buttonText>
        <Email class="h-6 w-6 text-zinc-700" />
        <span class="text-button w-full pr-6 text-zinc-700">Log in with Email</span>
      </template>
    </Button>
  </div>
</template>

<style scoped></style>
