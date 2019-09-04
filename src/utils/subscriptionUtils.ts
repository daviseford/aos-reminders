import { ISubscription } from 'types/subscription'

export const isSubscriber = (subscription: ISubscription) => subscription.subscribed && !subscription.expired
export const isActive = (subscription: ISubscription) => isSubscriber(subscription) && subscription.active
