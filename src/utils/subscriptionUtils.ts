import { ISubscription } from 'types/subscription'

export const isSubscriber = (subscription: ISubscription) => subscription.subscribed

export const isActiveSubscriber = (subscription: ISubscription) => {
  if (isPaypal(subscription)) {
    if (subscription.subscriptionStatus === 'pending_activation') return false
    if (hasActiveGrant(subscription)) return true
  }

  return isSubscriber(subscription) && !subscription.expired
}

export const isCanceledSubscriber = (subscription: ISubscription) => {
  return isSubscriber(subscription) && !subscription.active
}

export const isGiftedSubscriber = (subscription: ISubscription) => {
  return isActiveSubscriber(subscription) && subscription.planId === 'gifted'
}

export const isPendingSubscriber = (subscription: ISubscription) => {
  return subscription.subscriptionStatus === 'pending_activation' || hasActiveGrant(subscription)
}

export const hasActiveGrant = (subscription: ISubscription) => {
  return subscription.has_grant === true && subscription.subscriptionStatus === 'temporary_grant'
}

export const hasExpiredGrant = (subscription: ISubscription) => {
  return subscription.has_grant === false && subscription.subscriptionStatus === 'temporary_grant'
}

export const isStripe = (subscription: ISubscription) => subscription.createdBy === 'stripe'
export const isPaypal = (subscription: ISubscription) => subscription.createdBy === 'paypal'
