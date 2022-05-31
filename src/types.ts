export enum ArticlePlan {
  Free = 'free',
  Member = 'member',
  Subscriber = 'subscriber',
}

export interface Article {
  id: string
  plan: ArticlePlan
}
