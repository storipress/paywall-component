export type ApplyHandlerType = 'cancel' | 'create' | 'change' | 'update' | 'login' | 'logout'
export type UserDialogType =
  | 'welcome'
  | 'welcomeInSocial'
  | 'accountPlan'
  | 'signupFree'
  | 'signupPremium'
  | 'upgradeAccount'
  | 'freeAccount'
  | 'paidAccount'
  | 'subscribe'
  | 'confirmation'
  | 'shareToTwitter'

export interface SubscriberInput {
  first_name: string
  last_name: string
}

export interface SubscriptionPlan {
  name: string
  type: string
  priceId?: string
}

export interface DialogText {
  title: string
  sub: string
  button?: string
}

interface ProfileParams {
  type: 'update'
  input: SubscriberInput
}

interface PaymentParams {
  type: 'create' | 'change' | 'cancel'
  input: SubscriberInput
  plan: SubscriptionPlan
}

interface LoginParams {
  type: 'login'
  email: string
}

interface LogoutParams {
  type: 'logout'
}

export type UserDialogParams = ProfileParams | PaymentParams | LoginParams | LogoutParams
export type UserDialogHandler = (params: Omit<UserDialogParams, 'type'>) => Promise<unknown>
