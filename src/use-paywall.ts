import type { ApolloClient, ApolloError, NormalizedCacheObject } from '@apollo/client/core'
import { provideApolloClient } from '@vue/apollo-composable'
import type { Ref } from 'vue'
import { useSubscription } from './composables'
import { createPaywallMachine } from './machine'

export function usePaywallSystem(token: Ref<string | null>, client: ApolloClient<NormalizedCacheObject>) {
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
  const updateToken = (t: string | null) => {
    token.value = t
  }

  watch(token, (t) => {
    if (t) {
      refetchSubscriber()
    }
  })

  watch([subscriberProfile, token], ([p]) => {
    if (p && p.id) {
      reloadRef.value++
    }
  })

  return {
    reloadRef,
    reload: () => {
      reloadRef.value++
    },
    paywallMachine,
    updateToken,
  }
}
