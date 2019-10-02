import { ISubscription } from 'types/subscription'

export const isSubscriber = (subscription: ISubscription) => subscription.subscribed
export const isActiveSubscriber = (subscription: ISubscription) =>
  isSubscriber(subscription) && !subscription.expired
export const isCanceledSubscriber = (subscription: ISubscription) =>
  isSubscriber(subscription) && !subscription.active
