import { isString } from 'lodash'
import qs from 'qs'
import { logEvent, logGiftedSubscription, logSubscription } from 'utils/analytics'
import { loadArmyFromLink } from 'utils/loadArmy/loadArmyHelpers'

export const handleStripeCheckout = () => {
  const { subscribed = false, canceled = false, plan = '', gifted = false, quantity = '' } = qs.parse(
    window.location.search,
    {
      ignoreQueryPrefix: true,
    }
  )

  if (subscribed && isString(plan)) {
    logEvent(`Checkout-Subscribed-${plan}`)
    logSubscription(plan, 'stripe')
  }
  if (gifted && isString(plan) && isString(quantity)) {
    logEvent(`Checkout-Gifted-Subscription-${plan}-x-${quantity}`)
    logGiftedSubscription(plan, quantity)
  }
  if (canceled) logEvent(`Checkout-Canceled-${plan}`)

  if (subscribed || canceled || gifted) {
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
  return army as string | null
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
