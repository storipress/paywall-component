import { HttpResponse, graphql } from 'msw'
import { context } from '../context'

export const handler = graphql.query('SubscriberProfile', () => {
  if (!context.login) {
    return HttpResponse.json({
      data: {
        subscriberProfile: null,
      },
    })
  }

  return HttpResponse.json({
    data: {
      subscriberProfile: {
        id: '1',
        email: 'hello@example.com',
        verified: true,
        first_name: '',
        last_name: '',
        full_name: '',
        avatar: '',
        newsletter: true,
        renew_on: '',
        pm_last_four: '1234',
        subscribed: true,
        subscription_type: 'monthly',
        subscription: {
          interval: '12',
          price: '500',
        },
      },
    },
  })
})
