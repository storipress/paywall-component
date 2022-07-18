export type ApplyHandlerType = 'cancel' | 'create' | 'change' | 'update' | 'login' | 'logout'

export interface SubscriberInput {
  first_name: string
  last_name: string
}

export interface SubscriptionPlan {
  name: string
  type: string
  priceId?: string
}

export interface UserDialogParams {
  type: ApplyHandlerType
  input?: {
    first_name?: string
    last_name?: string
  }
  email?: string
  plan?: SubscriptionPlan
}
