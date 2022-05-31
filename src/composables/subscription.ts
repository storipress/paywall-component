import { useMutation, useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'

export function useSubscription() {
  const { result, refetch } = useQuery(gql`
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
      }
    }
  `)
  const onUpdateSubscriber = async ({ input }: { input: object }) => {
    try {
      await updateSubscriberMutate(input)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('e: ', e)
    }
  }

  return { subscriberProfile, refetchSubscriber: refetch, onUpdateSubscriber }
}
