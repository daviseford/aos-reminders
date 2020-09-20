import { ISubscription } from 'types/subscription'

export const isSubscriber = (subscription: ISubscription) => subscription.subscribed
export const isActiveSubscriber = (subscription: ISubscription) =>
  isSubscriber(subscription) &&
  !subscription.expired &&
  subscription.subscriptionStatus !== 'pending_activation'
export const isCanceledSubscriber = (subscription: ISubscription) =>
  isSubscriber(subscription) && !subscription.active
export const isGiftedSubscriber = (subscription: ISubscription) =>
  isActiveSubscriber(subscription) && subscription.planId === 'gifted'
export const isStripe = (subscription: ISubscription) => subscription.createdBy === 'stripe'
export const isPaypal = (subscription: ISubscription) => subscription.createdBy === 'paypal'
