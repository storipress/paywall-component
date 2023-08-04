import { useMutation } from '@vue/apollo-composable'
import { useStorage } from '@vueuse/core'
import gql from 'graphql-tag'
import { type Ref, computed } from 'vue'

export type AuthAPI = ReturnType<typeof useAuth>

export function useAuth(tokenRef: Ref<string | null> = useStorage('test-token', '')) {
  const { mutate: requestSignInSubscriberMutate } = useMutation(gql`
    mutation RequestSignInSubscriber($email: EmailString!, $referer: String!, $from: String!) {
      requestSignInSubscriber(input: { email: $email, referer: $referer, from: $from })
    }
  `)
  const { mutate: signUpSubscriberMutate } = useMutation(gql`
    mutation SignUpSubscriber($email: EmailString!, $referer: String!, $from: String!) {
      signUpSubscriber(input: { email: $email, referer: $referer, from: $from })
    }
  `)
  const { mutate: signOutSubscriberMutate } = useMutation(gql`
    mutation SignOutSubscriber {
      signOutSubscriber
    }
  `)
  const { mutate: verifySubscriberEmailMutate } = useMutation(gql`
    mutation VerifySubscriberEmail($token: String!) {
      verifySubscriberEmail(token: $token)
    }
  `)
  const { mutate: signInSubscriberMutate } = useMutation(gql`
    mutation SignInSubscriber($token: String!) {
      signInSubscriber(token: $token)
    }
  `)

  const onLogin = async ({ email }: { email: string }) => {
    try {
      const result = await requestSignInSubscriberMutate({
        email,
        referer: document.referrer || location.origin,
        from: location.href,
      })
      return result?.data.requestSignInSubscriber
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('e: ', e)
    }
    return false
  }
  const onSignup = async (email: string) => {
    try {
      const result = await signUpSubscriberMutate({
        email,
        referer: document.referrer || location.origin,
        from: location.href,
      })
      if (result?.data.signUpSubscriber) {
        tokenRef.value = result?.data.signUpSubscriber
        return result
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('e: ', e)
    }
    return false
  }
  const onSignOut = async () => {
    try {
      const result = await signOutSubscriberMutate()
      if (result?.data.signOutSubscriber) {
        tokenRef.value = ''
      }
      return result?.data.signOutSubscriber
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('e: ', e)
    }
    return false
  }
  const onVerifyEmail = async (token: string) => {
    try {
      const result = await verifySubscriberEmailMutate({ token })
      if (result?.data.verifySubscriberEmail) {
        return true
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('e: ', e)
    }
    return false
  }
  const onSignInSubscriber = async (token: string) => {
    try {
      const result = await signInSubscriberMutate({ token })
      if (result?.data.signInSubscriber) {
        try {
          localStorage.setItem('storipress-token', result?.data.signInSubscriber)
        } catch {}
        tokenRef.value = result?.data.signInSubscriber
        return true
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('e: ', e)
    }
    return false
  }

  const isAuth = computed(() => !!tokenRef.value)

  return {
    isAuth,
    onLogin,
    onSignup,
    onSignOut,
    onVerifyEmail,
    onSignInSubscriber,
  }
}
