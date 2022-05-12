<script setup lang="ts">
import { Button } from '../../index'
</script>

<template>
  <div class="flex-auto">
    <Button primary rounded color-hex="#55acee" class="layer-1 w-full mb-6">
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

    <div class="relative flex items-center justify-center h-6 my-6">
      <span class="absolute h-px w-full bg-[#979797]" />
      <span class="absolute bg-zinc-50 px-[0.6rem] text-lg font-semibold">Or</span>
    </div>

    <Button primary rounded color-hex="#ffffff" class="layer-1 w-full">
      <template #buttonText>
        <i class="icon-email text-zinc-700 text-2xl" />
        <span class="text-button text-zinc-700 w-full pr-6">Log in with Email</span>
      </template>
    </Button>
  </div>
</template>

<style scoped></style>
