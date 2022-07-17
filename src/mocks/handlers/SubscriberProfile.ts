import { graphql } from 'msw'
import { context } from '../context'

export const handler = graphql.query('SubscriberProfile', (_req, res, ctx) => {
  if (!context.login) {
    return res(
      ctx.data({
        subscriberProfile: null,
      })
    )
  }

  return res(
    ctx.data({
      subscriberProfile: {
        id: '1',
        email: 'alex@storipress.com',
        verified: true,
        first_name: 'Alex',
        last_name: 'Pan',
        full_name: 'Alex Pan',
        avatar: '',
        newsletter: true,
        renew_on: '',
        pm_last_four: '1234',
        subscribed: true,
        subscription_type: 'monthly',
        subscription: {
          interval: '12',
          price: '5',
        },
      },
    })
  )
})
