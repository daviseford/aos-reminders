import qs from 'qs'
import { logEvent, logSubscription } from './analytics'

export const handleCheckout = () => {
  const { subscribed = false, canceled = false, plan = '' } = qs.parse(window.location.search, {
    ignoreQueryPrefix: true,
  })

  if (subscribed) {
    logEvent(`Checkout-Subscribed-${plan}`)
    logSubscription(plan)
  }
  if (canceled) logEvent(`Checkout-Canceled-${plan}`)

  if (subscribed || canceled) {
    window.history.replaceState({}, document.title, window.location.pathname)
  }
}
