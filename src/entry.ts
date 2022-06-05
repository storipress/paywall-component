import './styles/utilties.css'
import type { Ref } from 'vue'
import { createApp } from 'vue'
import type { ApolloClient, NormalizedCacheObject } from '@apollo/client/core'
import { DefaultApolloClient } from '@vue/apollo-composable'
import PaywallSystem from './PaywallSystem.vue'
import type { Article } from './types'
import type { RouterLike } from './composables'
import { useAuth, useQueryAction } from './composables'
import { usePaywallSystem } from './use-paywall'
export * from './components'
export * from './composables'
export * from './machine'
export { PaywallSystem }
export { ref, reactive, computed, watch, watchEffect } from 'vue'
export { useStorage } from '@vueuse/core'

export interface CommentInfo {
  enable: boolean
  count: number
  onClick: () => void
}

export interface MountPaywallInput {
  el: HTMLElement | string
  client: ApolloClient<NormalizedCacheObject>
  logo: string
  router?: RouterLike
  comment: CommentInfo
  token: Ref<string | null>
}

export function mountPaywall({ el, client, logo, token, router, comment }: MountPaywallInput) {
  const { paywallMachine, updateToken, reload, reloadRef } = usePaywallSystem(token, client)
  const auth = useAuth(token)
  const check = useQueryAction({ auth, router, fallbackLocation: true })
  const app = createApp({
    setup: () => {
      return () => {
        return h(PaywallSystem, {
          key: reloadRef.value,
          token: token.value,
          logo,
          paywallMachine,
          hasComment: comment.enable,
          commentCount: comment.count,
          onCommentClick: comment.onClick,
          'onUpdate:token': updateToken,
        })
      }
    },
  })
  app.provide(DefaultApolloClient, client)
  app.mount(el)

  return {
    paywallMachine,
    check,
    reload,
    setArticle(article: Article) {
      paywallMachine.setArticle(article)
    },
    unmount() {
      app.unmount()
    },
  }
}
