import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

export function useAuth() {
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
        referer: location.origin,
        from: document.referrer,
      })
      if (result?.data.requestSignInSubscriber) {
        return true
      }
    } catch (e) {
      console.log('e: ', e)
    }
  }
  const onSignup = async (email: string) => {
    try {
      const result = await signUpSubscriberMutate({
        email,
        referer: location.origin,
        from: document.referrer,
      })
      if (result?.data.signUpSubscriber) {
        localStorage.setItem('test-token', result?.data.signUpSubscriber)
        return result
      }
    } catch (e) {
      console.log('e: ', e)
    }
  }
  const onSignOut = async () => {
    try {
      const result = await signOutSubscriberMutate()
      if (result?.data.signOutSubscriber) {
        localStorage.removeItem('test-token')
      }
    } catch (e) {
      console.log('e: ', e)
    }
  }
  const onVerifyEmail = async (token: string) => {
    try {
      const result = await verifySubscriberEmailMutate({ token })
      return result
    } catch (e) {
      console.log('e: ', e)
    }
  }
  const onSignInSubscriber = async (token: string) => {
    try {
      const result = await signInSubscriberMutate({ token })
      if (result?.data.signInSubscriber) {
        localStorage.setItem('test-token', result?.data.signInSubscriber)
      }
    } catch (e) {
      console.log('e: ', e)
    }
  }

  const isAuth = localStorage.getItem('test-token')

  return {
    isAuth,
    onLogin,
    onSignup,
    onSignOut,
    onVerifyEmail,
    onSignInSubscriber,
  }
}
