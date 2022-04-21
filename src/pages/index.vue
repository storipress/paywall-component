<script setup lang="ts">
const name = ref('')

const router = useRouter()
const go = () => {
  if (name.value) {
    router.push(`/hi/${encodeURIComponent(name.value)}`)
  }
}
</script>

<template>
  <div>
    <div class="inline-block text-4xl" />
    <p>
      <a rel="noreferrer" href="https://github.com/antfu/vitesse-lite" target="_blank"> Vitesse Lite </a>
    </p>
    <p>
      <em text-sm op75>Opinionated Vite Starter Template</em>
    </p>

    <div py-4 />

    <input
      id="input"
      v-model="name"
      placeholder="What's your name?"
      type="text"
      autocomplete="false"
      class="w-[250px] rounded border-gray-200 bg-transparent px-4 py-2 text-center outline-none active:outline-none"
      @keydown.enter="go"
    />

    <div>
      <button class="btn m-3 text-sm" :disabled="!name" @click="go">Go</button>
    </div>
  </div>
</template>
