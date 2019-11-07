import qs from 'qs'
import { logEvent, logSubscription } from './analytics'
import { loadArmyFromLink } from './loadArmyFromLink'

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

/**
 * Returns true if we are loading an army from a link embedded in the query params
 */
export const handleArmyLink = (): boolean => {
  const { army = '' } = qs.parse(window.location.search, {
    ignoreQueryPrefix: true,
  })
  if (!army) return false
  loadArmyFromLink(army)
  return true
}
