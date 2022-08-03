import { useMutation, useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import type { SubscriberInput, SubscriptionPlan } from '../components/UserDialog/definition'

export interface SubscriberProfile {
  id: string
  email: string
  verified: boolean
  first_name: string
  last_name: string
  full_name: string
  avatar: string
  newsletter: boolean
  renew_on: string
  card_last_four: string
  subscribed: boolean
  subscription_type: string
  subscription: {
    interval: string
    price: string
  }
}

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
        pm_last_four
        subscribed
        subscription_type
        subscription {
          interval
          price
        }
      }
    }
  `)
  const subscriberProfile = computed<SubscriberProfile>(() => {
    return result.value?.subscriberProfile ?? {}
  })

  const { mutate: updateSubscriberMutate } = useMutation(gql`
    mutation UpdateSubscriber($email: EmailString, $first_name: String, $last_name: String, $newsletter: Boolean) {
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

  const { mutate: createSubscriberSubscriptionMutate } = useMutation(gql`
    mutation CreateSubscriberSubscription($price_id: String!) {
      createSubscriberSubscription(price_id: $price_id)
    }
  `)

  const { mutate: changeSubscriberSubscriptionMutate } = useMutation(gql`
    mutation ChangeSubscriberSubscription($price_id: String!) {
      changeSubscriberSubscription(price_id: $price_id)
    }
  `)

  const { mutate: cancelSubscriberSubscriptionMutate } = useMutation(gql`
    mutation CancelSubscriberSubscription {
      cancelSubscriberSubscription
    }
  `)

  const updateSubscriber = async ({ input }: { input: SubscriberInput }) => {
    try {
      const result = await updateSubscriberMutate(input)
      return result?.data.updateSubscriber
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('e: ', e)
    }
  }

  const createSubscription = async ({ input, plan }: { input: SubscriberInput; plan: SubscriptionPlan }) => {
    try {
      await updateSubscriberMutate(input)
      const result = await createSubscriberSubscriptionMutate({ price_id: plan.priceId })
      return result?.data.createSubscriberSubscription
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('e: ', e)
    }
  }

  const changeSubscription = async ({ input, plan }: { input: SubscriberInput; plan: SubscriptionPlan }) => {
    try {
      await updateSubscriberMutate(input)
      await changeSubscriberSubscriptionMutate({ price_id: plan.priceId })
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('e: ', e)
    }
  }

  const cancelSubscription = async ({ input }: { input: SubscriberInput }) => {
    try {
      await updateSubscriberMutate(input)
      await cancelSubscriberSubscriptionMutate()
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('e: ', e)
    }
  }

  return {
    subscriberProfile,
    refetchSubscriber: refetch,
    updateSubscriber,
    createSubscription,
    changeSubscription,
    cancelSubscription,
  }
}
