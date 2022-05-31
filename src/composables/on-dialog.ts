import { noop } from 'lodash-es'
import { useAuth } from './auth'
import { useSubscription } from './subscription'

export function useUserDialog(type: string, { onLogin } = useAuth()) {
  const { onUpdateSubscriber } = useSubscription()
  const handlers: Record<string, (...args: any[]) => Promise<any>> = {
    welcome: onLogin,
    signupFree: onUpdateSubscriber,
    freeAccount: onUpdateSubscriber,
  }

  const switchApplyHandler = () => {
    return handlers[type] || noop
  }

  return {
    switchApplyHandler,
  }
}
