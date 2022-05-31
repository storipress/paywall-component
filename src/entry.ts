import './styles/utilties.css'
import type { Ref } from 'vue'
import { createApp } from 'vue'
import type { ApolloClient, ApolloError, NormalizedCacheObject } from '@apollo/client/core'
import { DefaultApolloClient, provideApolloClient } from '@vue/apollo-composable'
import PaywallSystem from './PaywallSystem.vue'
import { createPaywallMachine } from './machine'
import type { Article } from './types'
import { useSubscription } from './composables'
export * from './components'
export * from './composables'
export * from './machine'
export { PaywallSystem }
export { ref, reactive, watch, watchEffect } from 'vue'

export interface CommentInfo {
  enable: boolean
  count: number
  onClick: () => void
}

export interface MountPaywallInput {
  el: HTMLElement | string
  client: ApolloClient<NormalizedCacheObject>
  logo: string
  comment: CommentInfo
  token: Ref<string | null>
}

export function mountPaywall({ el, client, token, logo, comment }: MountPaywallInput) {
  provideApolloClient(client)
  const { refetchSubscriber, subscriberProfile } = useSubscription()
  const paywallMachine = createPaywallMachine({
    getProfile: async () => {
      if (token.value && subscriberProfile.value.id) {
        return subscriberProfile.value
      }
      try {
        const res = await refetchSubscriber()
        if (!res) {
          return null
        }
        const { data } = res
        return data.subscriberProfile
      } catch (e) {
        const err = e as ApolloError
        const isUnauth = err.graphQLErrors.some(({ message }) => message.includes('Unauthenticated'))
        if (isUnauth) {
          token.value = null
        }
        return null
      }
    },
  })
  paywallMachine.setClient(client)
  const reloadRef = ref(0)
  const app = createApp({
    setup: () => {
      const updateToken = (t: string | null) => {
        token.value = t
      }
      return () => {
        return h(PaywallSystem, {
          key: reloadRef.value,
          logo,
          token: token.value,
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

  watch(token, (t) => {
    if (t) {
      refetchSubscriber()
    }
  })

  watch(subscriberProfile, (p) => {
    if (p && p.id) {
      reloadRef.value++
    }
  })

  return {
    paywallMachine,
    reload() {
      reloadRef.value++
    },
    setArticle(article: Article) {
      paywallMachine.setArticle(article)
    },
    unmount() {
      app.unmount()
    },
  }
}
