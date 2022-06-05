import { tryOnScopeDispose } from '@vueuse/core'

export const DEFAULT_CONTEXT = Object.freeze({
  login: true,
  enableSubscription: true,
})

export const context = {
  ...DEFAULT_CONTEXT,
}

export function useMockContext(localContext: Partial<typeof DEFAULT_CONTEXT>) {
  Object.assign(context, localContext)

  tryOnScopeDispose(() => {
    Object.assign(context, DEFAULT_CONTEXT)
  })
}
