import { graphql } from 'msw'

export const handler = graphql.query('SiteSubscriptionInfo', (_req, res, ctx) => {
  return res(
    ctx.data({
      siteSubscriptionInfo: {
        name: 'Storipress',
        email: 'hello@storipress.com',
        subscription: true,
        newsletter: true,
        monthly_price: '5',
        yearly_price: '100',
      },
    })
  )
})
