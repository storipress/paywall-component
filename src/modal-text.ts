interface ModalText {
  title: string
  sub: string
  button?: string
}

const login: ModalText = {
  title: 'We’ve sent you a login link!',
  sub: "If the email doesn't arrive in 3 minutes, check your spam folder.",
  button: 'Close',
}

export const modalTexts: Record<string, ModalText> = {
  welcome: login,
  signupFree: login,
  signupPremium: login,
  upgradeAccount: {
    title: 'Thank you!',
    sub: 'You’re subscribed as __EMAIL__',
    button: 'Next',
  },
  shareToTwitter: {
    title: 'Spread the word',
    sub: 'If you want to help __PUBLICATION_NAME__ even more, share your reason for subscribing.',
  },
  error: {
    title: 'An error occurred',
    sub: 'Please retry later.',
    button: 'Close',
  },
}
