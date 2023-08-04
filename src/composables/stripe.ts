import type { Stripe, StripeElements } from '@stripe/stripe-js'
import { useMutation } from '@vue/apollo-composable'
import { whenever } from '@vueuse/core'
import gql from 'graphql-tag'
import invariant from 'tiny-invariant'
import { onMounted, ref, shallowRef } from 'vue'

const appearance = {
  rules: {
    '.Input': {
      border: '1px solid #3f3f46',
    },
  },
  variables: {
    colorBackground: 'transparent',
    colorText: '#27272a',
    fontSizeBase: '16px',
    colorTextPlaceholder: '#9ba3af',
    borderRadius: '0px',
  },
}

let publishableKey: string

export function setStripeKey(key: string) {
  publishableKey = key
}

export function useStripe(enabledStripe: boolean) {
  const reference = ref()
  const elements = shallowRef<StripeElements>()
  const error = ref()

  const createCard = (stripe: Stripe, clientSecret: string) => {
    elements.value = stripe.elements({
      clientSecret,
      appearance,
    })

    const card = elements.value.create('payment')
    whenever(reference, (reference) => card.mount(reference), { immediate: true })
  }

  const stripe = shallowRef<Stripe>()
  const { onDone, onError, mutate } = useMutation(gql`
    mutation RequestSetupIntent {
      requestSetupIntent
    }
  `)

  onMounted(() => {
    if (enabledStripe) mutate()
  })
  onDone(async ({ data }) => {
    if (!data) {
      return
    }

    invariant(publishableKey, 'Stripe key is not set')
    stripe.value = (await getStripe(publishableKey)) as Stripe
    createCard(stripe.value, data.requestSetupIntent)
  })
  onError(() => {
    error.value = 'Failed to Request App Setup Intent'
  })

  const { mutate: updatePaymentMethodMutate } = useMutation(gql`
    mutation UpdatePaymentMethod($pm_id: String!) {
      updatePaymentMethod(pm_id: $pm_id)
    }
  `)
  const isLoading = ref(false)
  const isError = ref(false)

  const confirmPayment = async () => {
    isLoading.value = true
    isError.value = false

    try {
      const { setupIntent, error } =
        (await stripe.value?.confirmSetup({
          elements: elements.value as StripeElements,
          redirect: 'if_required',
          confirmParams: {
            return_url: window.location.href,
          },
        })) || {}

      if (error || setupIntent?.status !== 'succeeded') {
        isLoading.value = false
        isError.value = true
        return
      }

      const result = await updatePaymentMethodMutate({ pm_id: setupIntent.payment_method as string })
      isLoading.value = false
      return result?.data.updatePaymentMethod
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('e: ', e)
      isLoading.value = false
      isError.value = true
    }
  }

  return {
    stripe,
    elements,
    reference,
    error,
    confirmPayment,
    isLoading,
    isError,
  }
}

async function getStripe(key: string) {
  const { loadStripe } = await import('@stripe/stripe-js')
  return await loadStripe(key)
}
