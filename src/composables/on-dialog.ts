import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

export function useUserDialog(type) {
  const { mutate: signInSubscriberMutate } = useMutation(gql`
    mutation RequestSignInSubscriber($email: Email!, $referer: String!, $from: String!) {
      requestSignInSubscriber(input: { email: $email, referer: $referer, from: $from })
    }
  `)
  const { mutate: signUpSubscriberMutate } = useMutation(gql`
    mutation SignUpSubscriber($email: Email!, $referer: String!, $from: String!) {
      signUpSubscriber(input: { email: $email, referer: $referer, from: $from })
    }
  `)

  const onLogin = async ({ email }: { email: string }) => {
    try {
      const result = await signInSubscriberMutate({
        email,
        referer: location.origin,
        from: document.referrer,
      })
      if (result?.data.requestSignInSubscriber) {
        console.log('done')
      }
    } catch (e) {
      console.log('e: ', e)
    }
  }
  const onSignup = async ({ email }: { email: string }) => {
    try {
      const result = await signUpSubscriberMutate({
        email,
        referer: location.origin,
        from: document.referrer,
      })
      if (result?.data.signUpSubscriber) {
        localStorage.setItem('test-token', result?.data.signUpSubscriber)
      }
    } catch (e) {
      console.log('e: ', e)
    }
  }

  const switchApplyHandler = () => {
    switch (type) {
      case 'welcome':
        return onLogin
    }
  }

  return {
    onSignup,
    switchApplyHandler,
  }
}
