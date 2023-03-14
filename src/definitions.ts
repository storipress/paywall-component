import type { EventBusKey } from '@vueuse/core'

export const SIGNUP_KEY: EventBusKey<string> = Symbol('signup')

export const SHOW_USER_DIALOG_KEY = Symbol('showUserDialog')
