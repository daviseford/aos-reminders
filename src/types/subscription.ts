export interface ISubscription {
  active?: boolean
  createdAt?: number
  customerId?: string
  expired?: boolean
  id?: string
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
  updatedAt?: number
  userName?: string
}
