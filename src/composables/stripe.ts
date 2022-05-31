import type { Stripe } from '@stripe/stripe-js'
import { loadStripe } from '@stripe/stripe-js'

export function useStripe() {
  const reference = ref()
  const createCard = (stripe: Stripe) => {
    const elements = stripe.elements()
    const style = {
      base: {
        color: '#27272a',
        fontSize: '16px',
        '::placeholder': {
          color: '#9ba3af',
        },
      },
    }

    const card = elements.create('card', { style })
    watch(
      reference,
      (reference) => {
        if (reference) {
          card.mount(reference)
        }
      },
      { immediate: true }
    )
  }

  onMounted(async () => {
    const stripe = await loadStripe('pk_test_qblFNYngBkEdjEZ16jxxoWSM')
    createCard(stripe!)
  })

  return {
    reference,
  }
}
