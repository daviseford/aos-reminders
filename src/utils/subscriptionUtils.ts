import { ISubscription } from 'types/subscription'

export const isSubscriber = (subscription: ISubscription) => subscription.subscribed && !subscription.expired
