import ReactGA from 'react-ga4'

const isDevelopment = import.meta.env.DEV
const isProduction = import.meta.env.PROD
const isTest = import.meta.env.MODE === 'test'

if (!isTest) {
  ReactGA.initialize('G-EM4GX294XG', {
    gaOptions: { siteSpeedSampleRate: 100 },
  })
}

const logToGA = (payload: { action: string; category: string; label: string }) => {
  if (isDevelopment) {
    console.log('GA Event: ', payload)
  } else if (isProduction) {
    ReactGA.event(payload)
  }
}

export const logClick = (label: string): void => {
  if (!label) return
  logToGA({
    category: 'Click',
    action: `Click-${label}`,
    label: 'AoS Reminders',
  })
}

export const logEvent = (event: string): void => {
  if (!event) return
  logToGA({
    category: 'Event',
    action: `Event-${event}`,
    label: 'AoS Reminders',
  })
}

export const logPageView = (): void => {
  if (!isProduction) return
  ReactGA.send({ hitType: 'pageview', page: window.location.pathname + window.location.search })
}

export const logSubscription = (plan: string, provider: 'paypal' | 'stripe'): void => {
  logEvent(`Subscription-${provider}-${plan}`)
}

export const logGiftedSubscription = (plan: string, quantity: string): void => {
  logEvent(`Gifted-Subscription-${plan}-x-${quantity}`)
}
