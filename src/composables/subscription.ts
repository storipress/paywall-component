import { useMutation, useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'

export function useSubscription() {
  const { result } = useQuery(gql`
    query SubscriberProfile {
      subscriberProfile {
        id
        email
        verified
        first_name
        last_name
        full_name
        avatar
        newsletter
        renew_on
        card_last_four
        subscribed
        subscription_type
        subscription {
          interval
          price
        }
      }
    }
  `)
  const subscriberProfile = computed(() => {
    return result.value?.subscriberProfile ?? {}
  })

  const { mutate: updateSubscriberMutate } = useMutation(gql`
    mutation UpdateSubscriber($email: Email, $first_name: String, $last_name: String, $newsletter: Boolean) {
      updateSubscriber(
        input: { email: $email, first_name: $first_name, last_name: $last_name, newsletter: $newsletter }
      ) {
        id
        first_name
        last_name
        full_name
        # newsletter
      }
    }
  `)
  const onUpdateSubscriber = async ({ input }: { input: object }) => {
    try {
      await updateSubscriberMutate(input)
    } catch (e) {
      console.log('e: ', e)
    }
  }

  return { subscriberProfile, onUpdateSubscriber }
}
