<script setup lang="ts">
import { computed } from 'vue'
import { User } from '../../Icons'
import CommentIcon from './CommentIcon.vue'

const props = defineProps({
  loginState: {
    type: Boolean,
    default: false,
  },
  accountAvatar: {
    type: String,
    default: '',
  },
  hasComment: {
    type: Boolean,
    default: false,
  },
  commentCount: {
    type: Number,
    default: 0,
  },
})
const emit = defineEmits<{
  (event: 'click'): void
  (event: 'clickComment'): void
}>()

const pillText = computed(() => {
  return props.loginState ? 'Account settings' : 'Subscribe | Login'
})

function onClick() {
  emit('click')
}
</script>

<template>
  <div class="layer-2 text-subheading flex h-10 w-fit items-center overflow-hidden rounded-full bg-white text-zinc-500">
    <!-- left text -->
    <div
      role="button"
      class="flex h-full items-center px-3.5 transition duration-100 hover:bg-stone-100"
      @click="onClick"
    >
      <!-- if avatar, show photo -->
      <img v-if="accountAvatar" :src="accountAvatar" class="overflow-none mr-2 h-5 w-5 rounded-full" />
      <!-- if no avatar, show icon -->
      <User v-else class="mr-2 h-4 w-4" />
      <span>{{ pillText }}</span>
    </div>
    <!-- if articles with comments, display comments count -->
    <!-- border -->
    <div v-if="hasComment" class="contents before:h-3 before:border-l before:border-l-zinc-200">
      <!-- comment count -->
      <div
        role="button"
        class="flex h-full items-center px-3.5 transition duration-100 hover:bg-stone-100"
        @click="$emit('clickComment')"
      >
        <CommentIcon class="mr-2" />
        <span>{{ commentCount }}</span>
      </div>
    </div>
  </div>
</template>
