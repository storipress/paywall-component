<script setup lang="ts">
const props = defineProps<{ name: string }>()
const router = useRouter()
</script>

<template>
  <div>
    <p>Hi, {{ props.name }}</p>
    <p class="text-sm opacity-50">
      <em>Dynamic route!</em>
    </p>

    <div>
      <button class="m-3 mt-8 text-sm" @click="router.back()">Back</button>
    </div>
  </div>
</template>
