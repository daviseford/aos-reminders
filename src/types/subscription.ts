import type { TThemeType } from 'types/theme'

export interface IGiftSubscription {
  id: string
  origin: 'admin' | 'stripe' | undefined
  planInterval: string
  planIntervalCount: number
  url: string
}

export interface Subscription {
  active?: boolean
  createdBy?: 'admin' | 'stripe' | 'paypal' | 'gift' | 'coupon'
  expired?: boolean
  giftSubscriptions?: IGiftSubscription[]
  has_grant?: boolean
  planId?: string
  planInterval?: string
  planIntervalCount?: number
  subscribed: boolean
  subscriptionId?: string
  subscriptionStart?: number
  subscriptionStatus?: 'active' | 'canceled' | 'pending_activation' | 'temporary_grant'
  theme?: TThemeType
}

export type ISubscription = Subscription
