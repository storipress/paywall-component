import type { DialogText, UserDialogType } from './definition'

const EMPTY: DialogText = {
  title: '',
  sub: '',
}

export const data: Record<UserDialogType | '', DialogText> = {
  welcome: {
    title: 'Welcome back.',
    sub: 'Enter your email below',
    button: 'Sign in',
  },
  welcomeInSocial: {
    title: 'Welcome back.',
    sub: 'Don’t have an account? Sign up',
  },
  freeAccount: {
    title: 'Your account.',
    sub: 'You are currently on a free membership.<br /> Upgrade to a paid subscription for full access.',
  },
  paidAccount: {
    title: 'Your account.',
    sub: 'You are currently on a __PAID_PLAN__ membership.<br /> Your subscription renews on __RENEWS_DATE__.',
  },
  accountPlan: {
    title: 'Your account.',
    sub: 'Update your account details:',
    button: 'Update account',
  },
  signupFree: {
    title: 'Complete your account.',
    sub: 'Sign up to __PUBLICATION_NAME__ to gain access to the story.',
    button: 'Complete account',
  },
  signupPremium: {
    title: 'Sign up for premium articles.',
    sub: 'Sign up to __PUBLICATION_NAME__ to gain access to the story.',
    button: 'Sign up',
  },
  upgradeAccount: {
    title: 'Upgrade your account',
    sub: 'Upgrade your account to gain access to the story.',
    button: 'Upgrade',
  },
  subscribe: {
    title: 'This post is for subscribers only.',
    sub: 'Sign up to __PUBLICATION_NAME__ to gain access to the story.',
    button: 'Subscribe',
  },
  confirmation: {
    title: 'One last step — verify your email',
    sub: `
    Thanks for subscribing! One last step before accessing this article — please verify your email to ensure you don’t get locked out of your account.
    <br /><br />
    Didn’t receive an email? Double-check your spam, or if you made a typo, change your email by clicking the button below.
    `,
    button: 'Change email',
  },
  shareToTwitter: EMPTY,
  '': EMPTY,
}
