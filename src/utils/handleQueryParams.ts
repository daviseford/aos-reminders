import qs from 'qs'
import { logEvent, logSubscription } from './analytics'
import { loadArmyFromLink } from './loadArmyFromLink'
import { ROUTES } from './env'

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
 * Returns an army link e.g.
 * aosreminders.com/?army=abc123 === abc123
 *
 * Returns null if no link is found
 */
export const getArmyLink = (): string | null => {
  const { army = null } = qs.parse(window.location.search, {
    ignoreQueryPrefix: true,
  })
  return army
}

/**
 * Returns true if we are loading an army from a link embedded in the query params
 */
export const handleArmyLink = (): boolean => {
  const link = getArmyLink()
  if (!link) return false
  loadArmyFromLink(link)
  return true
}

export const handleGiftRedemption = () => {
  const { redeem = null, referrer } = qs.parse(window.location.search, {
    ignoreQueryPrefix: true,
  })
  if (redeem && window.location.pathname !== ROUTES.REDEEM) {
    return window.location.replace(`${ROUTES.REDEEM}?redeem=${redeem}&referrer=${referrer}`)
  }
}
