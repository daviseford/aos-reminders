import { TSupportedFaction } from 'meta/factions'
import { TThemeType } from 'types/theme'

export interface IGiftSubscription {
  id: string
  origin: 'admin' | 'stripe' | undefined
  planInterval: string
  planIntervalCount: number
  url: string
  userName: string // The userName who gifted the subscription
}

export interface ISubscription {
  active?: boolean
  createdAt?: number
  customerId?: string
  expired?: boolean
  has_grant?: boolean
  favoriteFaction?: TSupportedFaction
  giftSubscriptions?: IGiftSubscription[]
  id: string
  planId?: string
  planInterval?: string
  planIntervalCount?: number
  subscribed: boolean
  subscriptionId?: string
  subscriptionStatus?: 'active' | 'canceled' | 'pending_activation' | 'temporary_grant'
  subscriptionCreated?: number
  subscriptionStart?: number
  subscriptionEnd?: number
  livemode?: boolean
  theme?: TThemeType
  updatedAt?: number
  userName: string
  createdBy?: 'admin' | 'stripe' | 'paypal' | 'gift' | 'coupon'
}
