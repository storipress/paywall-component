import { graphql } from 'msw'

export const handler = graphql.mutation('RequestSignInSubscriber', (_req, res, ctx) => {
  return res(
    ctx.data({
      requestSignInSubscriber: true,
    }),
  )
})
