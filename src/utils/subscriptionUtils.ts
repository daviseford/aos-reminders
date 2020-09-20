import { ISubscription } from 'types/subscription'

export const isSubscriber = (subscription: ISubscription) => subscription.subscribed
export const isActiveSubscriber = (subscription: ISubscription) => {
  if (subscription.has_grant) return true
  return (
    isSubscriber(subscription) &&
    !subscription.expired &&
    subscription.subscriptionStatus !== 'pending_activation'
  )
}
export const isCanceledSubscriber = (subscription: ISubscription) =>
  isSubscriber(subscription) && !subscription.active
export const isGiftedSubscriber = (subscription: ISubscription) =>
  isActiveSubscriber(subscription) && subscription.planId === 'gifted'
export const isPendingSubscriber = (subscription: ISubscription) =>
  subscription.subscriptionStatus === 'pending_activation'
export const isStripe = (subscription: ISubscription) => subscription.createdBy === 'stripe'
export const isPaypal = (subscription: ISubscription) => subscription.createdBy === 'paypal'
