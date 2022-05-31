import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import type { Ref } from 'vue'

export function useAuth(tokenRef: Ref<string | null> = useStorage('test-token', '')) {
  const { mutate: requestSignInSubscriberMutate } = useMutation(gql`
    mutation RequestSignInSubscriber($email: Email!, $referer: String!, $from: String!) {
      requestSignInSubscriber(input: { email: $email, referer: $referer, from: $from })
    }
  `)
  const { mutate: signUpSubscriberMutate } = useMutation(gql`
    mutation SignUpSubscriber($email: Email!, $referer: String!, $from: String!) {
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
      if (result?.data.requestSignInSubscriber) {
        return true
      }
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
        referer: location.origin,
        from: document.referrer,
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
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('e: ', e)
    }
    return false
  }
  const onVerifyEmail = async (token: string) => {
    try {
      const result = await verifySubscriberEmailMutate({ token })
      return result
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
        tokenRef.value = result?.data.signInSubscriber
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
