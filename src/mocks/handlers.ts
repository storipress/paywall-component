import { RequestHandler } from 'msw'

export const handlers = Array.from(
  Object.values(import.meta.glob<{ handler: RequestHandler }>('./handlers/*.ts', { eager: true })),
  ({ handler }) => handler
)
