import { ISubscription } from 'types/subscription'

export const isSubscriber = (subscription: ISubscription) => subscription.subscribed
export const isActiveSubscriber = (subscription: ISubscription) =>
  isSubscriber(subscription) && !subscription.expired
export const isCanceledSubscriber = (subscription: ISubscription) =>
  isSubscriber(subscription) && !subscription.active
export const isGiftedSubscriber = (subscription: ISubscription) =>
  isActiveSubscriber(subscription) && subscription.planId === 'gifted'
export const isStripe = (subscription: ISubscription) => subscription.createdBy === 'stripe'
export const isPaypal = (subscription: ISubscription) => subscription.createdBy === 'paypal'
