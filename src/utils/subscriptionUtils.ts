import type { Subscription } from 'types/subscription'

export const isSubscriber = (subscription: Subscription) => subscription.subscribed
export const isPaypal = (subscription: Subscription) => subscription.createdBy === 'paypal'
export const isStripe = (subscription: Subscription) => subscription.createdBy === 'stripe'

export const hasActiveGrant = (subscription: Subscription) =>
  subscription.has_grant === true && subscription.subscriptionStatus === 'temporary_grant'

export const hasExpiredGrant = (subscription: Subscription) =>
  subscription.has_grant === false && subscription.subscriptionStatus === 'temporary_grant'

export const isActiveSubscriber = (subscription: Subscription) => {
  if (isPaypal(subscription)) {
    if (subscription.subscriptionStatus === 'pending_activation') return false
    if (hasActiveGrant(subscription)) return true
  }
  return isSubscriber(subscription) && !subscription.expired
}

export const isCanceledSubscriber = (subscription: Subscription) =>
  isSubscriber(subscription) && !subscription.active

export const isGiftedSubscriber = (subscription: Subscription) =>
  isActiveSubscriber(subscription) && subscription.planId === 'gifted'

export const isPendingSubscriber = (subscription: Subscription) =>
  subscription.subscriptionStatus === 'pending_activation' || hasActiveGrant(subscription)
