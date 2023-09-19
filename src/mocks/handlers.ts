import type { GraphQLHandler } from 'msw'

export const handlers = Array.from(
  Object.values(import.meta.glob<{ handler: GraphQLHandler }>('./handlers/*.ts', { eager: true })),
  ({ handler }) => {
    return handler
  },
)
