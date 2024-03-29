import './styles/utilties.css'
import type { Ref } from 'vue'
import { computed, createApp, h, ref } from 'vue'
import type { ApolloClient, NormalizedCacheObject } from '@apollo/client/core'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { useEventBus } from '@vueuse/core'
import PaywallSystem from './PaywallSystem.vue'
import type { Article } from './types'
import type { RouterLike } from './composables'
import { useAuth, useQueryAction } from './composables'
import { usePaywallSystem } from './use-paywall'
import { SHOW_USER_DIALOG_KEY, SIGNUP_KEY } from './definitions'

export * from './components'
export * from './composables'
export * from './machine'
export { PaywallSystem }
export { ref, reactive, computed, watch, watchEffect } from 'vue'
export { SIGNUP_KEY, SHOW_USER_DIALOG_KEY } from './definitions'
export { useStorage, useStorageAsync, syncRef, useEventBus } from '@vueuse/core'

export interface CommentInfo {
  enable: boolean
  count: number
  onClick: () => void
}

export interface MountPaywallInput {
  el: HTMLElement | string
  client: ApolloClient<NormalizedCacheObject>
  favicon: string
  logo: string
  router?: RouterLike
  comment: CommentInfo
  token: Ref<string | null>
}

export function mountPaywall({ el, client, favicon, logo, token, router, comment }: MountPaywallInput) {
  const { paywallMachine, updateToken, reload, reloadRef, profile } = usePaywallSystem(token, client)
  const auth = useAuth(token)
  const check = useQueryAction({ auth, router, fallbackLocation: true })
  const inArticle = ref(false)
  const mapElementIdToArticleForPaywall = ref<Record<string, Article>>({})
  const app = createApp({
    setup: () => {
      const mapIdToArticle = computed(() => mapElementIdToArticleForPaywall.value)
      return () => {
        return h(PaywallSystem, {
          key: reloadRef.value,
          token: token.value,
          favicon,
          logo,
          paywallMachine,
          inArticle: inArticle.value,
          hasComment: comment.enable,
          commentCount: comment.count,
          // Here can not directly use the outside ref variable, this app will not be notify if the ref is updated. So here uses an computed function to wrap the ref to manully add an listener for the ref change.
          mapElementIdToArticleForPaywall: mapIdToArticle.value,
          hideFloatingPaywall: true,
          onClickComment: comment.onClick,
          'onUpdate:token': updateToken,
        })
      }
    },
  })
  app.provide(DefaultApolloClient, client)
  app.mount(el)

  const { emit } = useEventBus(SIGNUP_KEY)
  const { emit: emitBadge } = useEventBus(SHOW_USER_DIALOG_KEY)

  return {
    profile,
    paywallMachine,
    check,
    reload,
    signUp: emit,
    showUserDialog: emitBadge,
    setInArticle: (value: boolean) => {
      inArticle.value = value
    },
    setArticle(article: Article) {
      paywallMachine.setArticle(article)
    },
    mountArticlePaywall(id: string, article: Article) {
      mapElementIdToArticleForPaywall.value = {
        ...mapElementIdToArticleForPaywall.value,
        [id]: article,
      }
    },
    unmountAllArticlePaywall() {
      mapElementIdToArticleForPaywall.value = {}
    },
    unmount() {
      mapElementIdToArticleForPaywall.value = {}
      app.unmount()
    },
  }
}
