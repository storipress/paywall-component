import type { ApolloClient, NormalizedCacheObject } from '@apollo/client/core'
import { noop } from 'lodash-es'
import type { Ref } from 'vue'
import { markRaw, nextTick, reactive, ref } from 'vue'
import { P, match } from 'ts-pattern'
import type { Article } from '../types'
import { ArticlePlan } from '../types'

export enum PaywallState {
  Init,
  Ready,
  CheckPlan,
  LoggedIn,
  PaywallOrLogIn,
}

export enum LoginReason {
  None,
  NotLoggedIn,
  NotSubscribed,
}

export interface API {
  profile: Ref<SubscriberProfile | null>
}

export interface SubscriberProfile {
  id: string
  email: string
  full_name: string
  avatar: string
  subscribed: boolean
}

// hand write state machine
export function createPaywallMachine({ profile }: API) {
  const state = ref(PaywallState.Init)
  const context = reactive({
    client: null as ApolloClient<NormalizedCacheObject> | null,
    article: null as null | Article,
    reason: LoginReason.None,
    profile,
  })

  async function checkPlan() {
    match([context.article?.plan, profile.value?.subscribed] as const)
      .with([ArticlePlan.Free, undefined], () => {
        context.reason = LoginReason.None
        state.value = PaywallState.PaywallOrLogIn
      })
      .with([P.union(ArticlePlan.Member, ArticlePlan.Subscriber), P.nullish], () => {
        context.reason = LoginReason.NotLoggedIn
        state.value = PaywallState.PaywallOrLogIn
      })
      .with([ArticlePlan.Subscriber, false], () => {
        context.reason = LoginReason.NotSubscribed
        state.value = PaywallState.PaywallOrLogIn
      })
      .with(
        P.union(
          [ArticlePlan.Free, P.boolean] as const,
          [ArticlePlan.Member, P.boolean] as const,
          [ArticlePlan.Subscriber, true] as const
        ),
        () => {
          context.reason = LoginReason.None
          state.value = PaywallState.LoggedIn
        }
      )
      .with([P.nullish, P.union(P.nullish, P.boolean)], noop)
      .exhaustive()
  }

  let isChecking = false
  async function debounceCheckPlan() {
    if (isChecking) {
      return
    }
    isChecking = true
    await nextTick()
    isChecking = false
    checkPlan()
  }

  watch(
    [state, () => context.article, profile],
    async ([s]) => {
      if (s === PaywallState.Init) {
        return
      }
      debounceCheckPlan()
    },
    { immediate: true, deep: true }
  )

  function resetState() {
    context.reason = LoginReason.None
    state.value = PaywallState.CheckPlan
  }

  return markRaw({
    state,
    context,
    paywall: computed(() => context.reason !== LoginReason.None),
    checkPlan,
    setClient: (client: ApolloClient<NormalizedCacheObject>) => {
      if (state.value !== PaywallState.Init) {
        return
      }

      context.client = markRaw(client)
      state.value = PaywallState.Ready
    },
    setArticle: (article: any) => {
      if (state.value === PaywallState.Init || context.article === article) {
        return
      }
      context.article = article
      state.value = PaywallState.CheckPlan
      debounceCheckPlan()
    },
    reset(article: any) {
      context.article = article
      resetState()
    },
    resetState,
  })
}
