import { HttpResponse, graphql } from 'msw'

export const handler = graphql.mutation('RequestSignInSubscriber', () => {
  return HttpResponse.json({
    data: {
      requestSignInSubscriber: true,
    },
  })
})
