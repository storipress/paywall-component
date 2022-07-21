import type { ApolloClient, ApolloError, NormalizedCacheObject } from '@apollo/client/core'
import { provideApolloClient } from '@vue/apollo-composable'
import type { Ref } from 'vue'
import { nextTick } from 'vue'
import pRetry from 'p-retry'
import { useSubscription } from './composables'
import { createPaywallMachine } from './machine'

export function usePaywallSystem(token: Ref<string | null>, client: ApolloClient<NormalizedCacheObject>) {
  provideApolloClient(client)
  const { refetchSubscriber, subscriberProfile } = useSubscription()
  const paywallMachine = createPaywallMachine({
    profile: computed(() => {
      if (token.value && subscriberProfile.value.id) {
        return subscriberProfile.value
      }
      return null
    }),
  })
  paywallMachine.setClient(client)
  const reloadRef = ref(0)
  const updateToken = (t: string | null) => {
    token.value = t
  }

  function reload() {
    reloadRef.value++
  }

  watch(token, async (t) => {
    if (t) {
      try {
        await nextTick()
        await pRetry(() => refetchSubscriber(), { retries: 3 })
      } catch (e) {
        const isUnauth = checkUnauth(e)
        if (isUnauth) {
          token.value = null
        }
      }
    } else {
      reload()
    }
  })

  return {
    reloadRef,
    reload,
    paywallMachine,
    updateToken,
  }
}

function checkUnauth(e: unknown) {
  const err = e as ApolloError
  return err.graphQLErrors.some(({ message }) => message.includes('Unauthenticated'))
}
