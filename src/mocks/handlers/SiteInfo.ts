import { HttpResponse, graphql } from 'msw'

export const handler = graphql.query('SiteSubscriptionInfo', () => {
  return HttpResponse.json({
    data: {
      name: 'Storipress',
      email: 'hello@storipress.com',
      subscription: true,
      newsletter: true,
      monthly_price: '5',
      yearly_price: '100',
      monthly_price_id: 'price_1LPlC3Rhl9bYbVxV2AO42x0H',
      yearly_price_id: 'price_1LPlC4Rhl9bYbVxVYA9I7Z53',
    },
  })
})
