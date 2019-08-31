export interface ISubscription {
  createdAt?: number
  customerId?: string
  expired?: boolean
  id?: string
  planId?: string
  planInterval?: string
  planIntervalCount?: number
  subscribed: boolean
  subscriptionCreated?: number
  updatedAt?: number
  userName?: string
}
