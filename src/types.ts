import type { InjectionKey, Ref } from 'vue'

export enum ArticlePlan {
  Free = 'free',
  Member = 'member',
  Subscriber = 'subscriber',
}

export interface Article {
  id: string
  plan: ArticlePlan
}

export const LOADING_KEY: InjectionKey<Readonly<Ref<boolean>> | boolean> = Symbol('isLoading')
