import { isString } from 'lodash'
import qs from 'qs'
import { logEvent, logGiftedSubscription, logSubscription } from 'utils/analytics'

export const handleStripeCheckout = () => {
  const {
    subscribed = false,
    canceled = false,
    plan = '',
    gifted = false,
    quantity = '',
  } = qs.parse(window.location.search, {
    ignoreQueryPrefix: true,
  })

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
