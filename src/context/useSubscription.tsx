import { useAuth0 } from '@auth0/auth0-react'
import { SubscriptionApi } from '../api/subscriptionApi'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import type { Subscription } from 'types/subscription'
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
  id: '',
  userName: '',
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
  const { isLoading, user } = useAuth0()
  const [subscription, setSubscription] = useState(emptySubscription)
  const [subscriptionError, setSubscriptionError] = useState<string | null>(null)
  const [subscriptionLoading, setSubscriptionLoading] = useState(false)
  const [isNotSubscribed, setIsNotSubscribed] = useState(false)

  useEffect(() => {
    if (isLoading) return
    if (!user) setIsNotSubscribed(true)
  }, [isLoading, user])

  const getSubscription = useCallback(async () => {
    if (!user?.email) {
      setSubscription(emptySubscription)
      setSubscriptionError(null)
      setIsNotSubscribed(true)
      return
    }

    setSubscriptionLoading(true)
    setSubscriptionError(null)
    try {
      const response = await SubscriptionApi.getSubscription(user.email)
      setSubscription(response.body as Subscription)
      setIsNotSubscribed(false)
    } catch (error) {
      const status =
        typeof error === 'object' && error !== null && 'status' in error ? Number(error.status) : undefined
      setSubscription(emptySubscription)
      setIsNotSubscribed(status === 501)
      if (status !== 501) {
        setSubscriptionError('Subscription status is temporarily unavailable. Please try again.')
      }
    } finally {
      setSubscriptionLoading(false)
    }
  }, [user?.email])

  useEffect(() => {
    if (!isLoading) void getSubscription()
  }, [getSubscription, isLoading])

  const cancelSubscription = useCallback(async () => {
    if (!subscription.userName || !subscription.subscriptionId) return
    await SubscriptionApi.cancelSubscription({
      userName: subscription.userName,
      subscriptionId: subscription.subscriptionId,
    })
    await getSubscription()
  }, [getSubscription, subscription.subscriptionId, subscription.userName])

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
