<script setup lang="ts">
import { Button, UserDialog } from '../../index'
import spLogo from '../../../../assets/sp-logo-white.svg'
</script>

<template>
  <UserDialog title="Welcome back." description="Enter your email below" :logo="spLogo">
    <Button primary rounded color-hex="#ffffff" class="layer-1 w-full mb-6">
      <template #buttonText>
        <i class="icon-email text-zinc-700 text-2xl" />
        <span class="text-button text-zinc-700 w-full pr-6">Log in with Email</span>
      </template>
    </Button>

    <input
      type="text"
      placeholder="Email address"
      class="text-inputs border-zinc-700 w-full h-12 px-4 py-3 bg-transparent border"
    />

    <Button text="Sign in" primary rounded class="w-full mt-56" />
  </UserDialog>
</template>

<style scoped></style>
