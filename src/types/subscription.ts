import { TThemeType } from './theme'
import { TSupportedFaction } from 'meta/factions'

export interface ISubscription {
  active?: boolean
  createdAt?: number
  customerId?: string
  expired?: boolean
  favoriteFaction?: TSupportedFaction
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
