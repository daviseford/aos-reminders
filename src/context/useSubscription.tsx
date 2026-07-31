import { useAuth0 } from '@auth0/auth0-react'
import { SubscriptionApi } from '../api/subscriptionApi'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import type { Subscription } from 'types/subscription'
import { useApiAccessToken } from 'utils/authToken'
import {
  hasActiveGrant,
  hasExpiredGrant,
  isActiveSubscriber,
  isCanceledSubscriber,
  isGiftedSubscriber,
  isPaypal,
  isPendingSubscriber,
  isStripe,
  isSubscriber,
} from 'utils/subscriptionUtils'

const emptySubscription: Subscription = {
  subscribed: false,
}

interface SubscriptionContextValue {
  cancelSubscription: () => Promise<void>
  createdByPaypal: boolean
  createdByStripe: boolean
  getSubscription: () => Promise<void>
  hasActiveGrant: boolean
  hasExpiredGrant: boolean
  isActive: boolean
  isCanceled: boolean
  isGifted: boolean
  isNotSubscribed: boolean
  isPending: boolean
  isSubscribed: boolean
  subscription: Subscription
  subscriptionError: string | null
  subscriptionLoading: boolean
}

const SubscriptionContext = React.createContext<SubscriptionContextValue | undefined>(undefined)

const SubscriptionProvider = ({ children }: React.PropsWithChildren<object>) => {
  const { isAuthenticated, isLoading, user } = useAuth0()
  const getAccessToken = useApiAccessToken()
  const [subscription, setSubscription] = useState(emptySubscription)
  const [subscriptionError, setSubscriptionError] = useState<string | null>(null)
  const [subscriptionLoading, setSubscriptionLoading] = useState(false)
  const [isNotSubscribed, setIsNotSubscribed] = useState(false)

  useEffect(() => {
    if (isLoading) return
    if (!isAuthenticated || !user) setIsNotSubscribed(true)
  }, [isAuthenticated, isLoading, user])

  const getSubscription = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setSubscription(emptySubscription)
      setSubscriptionError(null)
      setIsNotSubscribed(true)
      return
    }

    setSubscriptionLoading(true)
    setSubscriptionError(null)
    try {
      const token = await getAccessToken()
      const response = await SubscriptionApi.getSubscription(token)
      setSubscription(response.body as Subscription)
      setIsNotSubscribed(false)
    } catch (error) {
      const status =
        typeof error === 'object' && error !== null && 'status' in error ? Number(error.status) : undefined
      setSubscription(emptySubscription)
      setIsNotSubscribed(status === 404)
      if (status !== 404) {
        setSubscriptionError('Subscription status is temporarily unavailable. Please try again.')
      }
    } finally {
      setSubscriptionLoading(false)
    }
  }, [getAccessToken, isAuthenticated, user])

  useEffect(() => {
    if (!isLoading) void getSubscription()
  }, [getSubscription, isLoading])

  const cancelSubscription = useCallback(async () => {
    if (!isAuthenticated) return

    const token = await getAccessToken()
    await SubscriptionApi.cancelSubscription(token)
    await getSubscription()
  }, [getAccessToken, getSubscription, isAuthenticated])

  const value = useMemo(
    () => ({
      cancelSubscription,
      createdByPaypal: isPaypal(subscription),
      createdByStripe: isStripe(subscription),
      getSubscription,
      hasActiveGrant: hasActiveGrant(subscription),
      hasExpiredGrant: hasExpiredGrant(subscription),
      isActive: isActiveSubscriber(subscription),
      isCanceled: isCanceledSubscriber(subscription),
      isGifted: isGiftedSubscriber(subscription),
      isNotSubscribed,
      isPending: isPendingSubscriber(subscription),
      isSubscribed: isSubscriber(subscription),
      subscription,
      subscriptionError,
      subscriptionLoading,
    }),
    [
      cancelSubscription,
      getSubscription,
      isNotSubscribed,
      subscription,
      subscriptionError,
      subscriptionLoading,
    ]
  )

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>
}

const useSubscription = () => {
  const context = React.useContext(SubscriptionContext)
  if (!context) throw new Error('useSubscription must be used within a SubscriptionProvider')
  return context
}

export { SubscriptionProvider, useSubscription }
