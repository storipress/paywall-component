import { noop } from 'lodash-es'
import type { MaybeRef } from '@vueuse/core'
import { unref } from 'vue'
import { useAuth } from './auth'
import { useSubscription } from './subscription'

export function useUserDialog(type: MaybeRef<string>, { onLogin } = useAuth()) {
  const { onUpdateSubscriber } = useSubscription()
  const handlers: Record<string, (...args: any[]) => Promise<any>> = {
    welcome: onLogin,
    signupFree: onUpdateSubscriber,
    freeAccount: onUpdateSubscriber,
    accountPlan: onUpdateSubscriber,
    signupPremium: onUpdateSubscriber,
    upgradeAccount: onUpdateSubscriber,
    subscribe: onUpdateSubscriber,
  }

  const switchApplyHandler = () => {
    return handlers[unref(type)] || noop
  }

  return {
    switchApplyHandler,
  }
}
