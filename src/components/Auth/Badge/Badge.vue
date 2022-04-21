<template>
  <div
    class="layer-2 text-subheading flex w-fit items-center rounded-3xl border border-gray-100 bg-white py-2.5 px-3.5 h-10"
  >
    <!-- left text -->
    <div role="button" class=" flex items-center" @click="onClickPill">
      <img v-if="accountAvatar" :src="accountAvatar" class="layer-0 rounded-xl w-5 h-5 mr-2" />
      <i v-else class="icon-user mr-2 text-xl" />
      <span>{{ pillText }}</span>
    </div>
    <!-- if articles with comments, display comments count -->
    <div
      v-if="commentCount"
      class="contents before:ml-4 before:mr-5 before:h-3 before:border-l before:border-l-zinc-200"
    >
      <img src="../../../../assets/comments.svg" class="mr-2" />
      <span>{{ commentCount }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps({
  loginState: {
    type: Boolean,
    default: false,
  },
  accountAvatar: {
    type: String,
    default: '',
  },
  commentCount: {
    type: Number,
    default: 0,
  },
})
const emit = defineEmits<{
  (event: 'onClickPill'): void
}>()

const pillText = computed(() => {
  return props.loginState ? 'Account settings' : 'Login'
})

const onClickPill = () => {
  emit('onClickPill')
}
</script>

<style scoped></style>
