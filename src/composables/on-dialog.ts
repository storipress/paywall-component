import { useAuth } from './auth'
import { useSubscription } from './subscription'

export function useUserDialog(type) {
  const { onLogin } = useAuth()
  const { onUpdateSubscriber } = useSubscription()

  const switchApplyHandler = () => {
    switch (type) {
      case 'welcome':
        return onLogin
      case 'signupFree':
        return onUpdateSubscriber
      case 'freeAccount':
        return onUpdateSubscriber
    }
  }

  return {
    switchApplyHandler,
  }
}
