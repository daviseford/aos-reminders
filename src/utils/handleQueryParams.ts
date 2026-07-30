import { logCheckoutCancelled, logPurchase } from 'utils/analytics'
import {
  findGiftedSubscriptionPlan,
  findSubscriptionPlan,
  MAX_GIFT_QUANTITY,
  toGiftSubscriptionAnalyticsItem,
  toSubscriptionAnalyticsItem,
} from 'utils/plans'

const checkoutKeys = [
  'subscribed',
  'canceled',
  'gifted',
  'checkout_kind',
  'plan',
  'quantity',
  'checkout_session_id',
] as const

const cleanCheckoutState = (url: URL): void => {
  checkoutKeys.forEach(key => url.searchParams.delete(key))
  window.history.replaceState({}, document.title, `${url.pathname}${url.search}${url.hash}`)
}

export const handleStripeCheckout = () => {
  const url = new URL(window.location.href)
  const { searchParams } = url
  const hasCheckoutState = ['subscribed', 'canceled', 'gifted'].some(key => searchParams.has(key))
  if (!hasCheckoutState) return

  const subscribed = searchParams.get('subscribed') === 'true'
  const canceled = searchParams.get('canceled') === 'true'
  const gifted = searchParams.get('gifted') === 'true'
  if (Number(subscribed) + Number(canceled) + Number(gifted) !== 1) {
    cleanCheckoutState(url)
    return
  }

  const planTitle = searchParams.get('plan') ?? ''
  const transactionId = searchParams.get('checkout_session_id')?.trim() ?? ''
  const checkoutKind = searchParams.get('checkout_kind')

  if (subscribed && checkoutKind === 'subscription' && transactionId) {
    const plan = findSubscriptionPlan(planTitle)
    if (plan) {
      logPurchase({
        items: [toSubscriptionAnalyticsItem(plan)],
        provider: 'stripe',
        transactionId,
      })
    }
  }

  const quantity = Number(searchParams.get('quantity'))
  const validGiftQuantity = Number.isInteger(quantity) && quantity >= 1 && quantity <= MAX_GIFT_QUANTITY
  if (gifted && checkoutKind === 'gift_subscription' && transactionId && validGiftQuantity) {
    const plan = findGiftedSubscriptionPlan(planTitle)
    if (plan) {
      logPurchase({
        items: [toGiftSubscriptionAnalyticsItem(plan, quantity)],
        provider: 'stripe',
        transactionId,
      })
    }
  }

  if (canceled) {
    if (checkoutKind === 'gift_subscription') {
      const plan = findGiftedSubscriptionPlan(planTitle)
      if (plan) {
        logCheckoutCancelled({
          items: [toGiftSubscriptionAnalyticsItem(plan, validGiftQuantity ? quantity : 1)],
          provider: 'stripe',
        })
      }
    } else if (checkoutKind === 'subscription') {
      const plan = findSubscriptionPlan(planTitle)
      if (plan) {
        logCheckoutCancelled({
          items: [toSubscriptionAnalyticsItem(plan)],
          provider: 'stripe',
        })
      }
    }
  }

  cleanCheckoutState(url)
}
