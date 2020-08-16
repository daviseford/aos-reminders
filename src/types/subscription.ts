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
  favoriteFaction?: TSupportedFaction
  giftSubscriptions?: IGiftSubscription[]
  id: string
  planId?: string
  planInterval?: string
  planIntervalCount?: number
  subscribed: boolean
  subscriptionId?: string
  subscriptionStatus?: 'active' | 'canceled'
  subscriptionCreated?: number
  subscriptionStart?: number
  subscriptionEnd?: number
  livemode?: boolean
  theme?: TThemeType
  updatedAt?: number
  userName: string
}
