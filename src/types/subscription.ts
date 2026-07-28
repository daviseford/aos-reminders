import type { TThemeType } from 'types/theme'

export interface IGiftSubscription {
  id: string
  origin: 'admin' | 'stripe' | undefined
  planInterval: string
  planIntervalCount: number
  url: string
  userName: string
}

export interface Subscription {
  active?: boolean
  createdAt?: number
  createdBy?: 'admin' | 'stripe' | 'paypal' | 'gift' | 'coupon'
  customerId?: string
  expired?: boolean
  favoriteFaction?: string
  giftSubscriptions?: IGiftSubscription[]
  has_grant?: boolean
  id: string
  livemode?: boolean
  planId?: string
  planInterval?: string
  planIntervalCount?: number
  subscribed: boolean
  subscriptionCreated?: number
  subscriptionEnd?: number
  subscriptionId?: string
  subscriptionStart?: number
  subscriptionStatus?: 'active' | 'canceled' | 'pending_activation' | 'temporary_grant'
  theme?: TThemeType
  updatedAt?: number
  userName: string
}

export type ISubscription = Subscription
