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
  /**
   * The lookup failed because this browser's sign-in can no longer be renewed, not because the
   * service is down. Retrying cannot fix that; only a fresh login can.
   */
  subscriptionNeedsLogin: boolean
}

/*
 * Auth0 rotates refresh tokens, and one that has been revoked, expired, or superseded comes back as
 * `invalid_grant`. The SDK still reports the session as signed in, because the cached ID token is
 * intact, so the lookup used to fail as "temporarily unavailable" on every visit and "Check again"
 * could never succeed. `useApiAccessToken` turns every token failure into this error; a 401 from the
 * API means the same thing from the other side.
 */
const needsLogin = (error: unknown): boolean => {
  if (typeof error !== 'object' || error === null) return false
  if ('name' in error && error.name === 'AuthenticationRequiredError') return true
  return 'status' in error && Number(error.status) === 401
}

const SubscriptionContext = React.createContext<SubscriptionContextValue | undefined>(undefined)

const SubscriptionProvider = ({ children }: React.PropsWithChildren<object>) => {
  const { isAuthenticated, isLoading, user } = useAuth0()
  const getAccessToken = useApiAccessToken()
  const [subscription, setSubscription] = useState(emptySubscription)
  const [subscriptionError, setSubscriptionError] = useState<string | null>(null)
  const [subscriptionLoading, setSubscriptionLoading] = useState(false)
  const [subscriptionNeedsLogin, setSubscriptionNeedsLogin] = useState(false)
  const [isNotSubscribed, setIsNotSubscribed] = useState(false)

  useEffect(() => {
    if (isLoading) return
    if (!isAuthenticated || !user) setIsNotSubscribed(true)
  }, [isAuthenticated, isLoading, user])

  const getSubscription = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setSubscription(emptySubscription)
      setSubscriptionError(null)
      setSubscriptionNeedsLogin(false)
      setIsNotSubscribed(true)
      return
    }

    setSubscriptionLoading(true)
    setSubscriptionError(null)
    setSubscriptionNeedsLogin(false)
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
      if (needsLogin(error)) {
        setSubscriptionNeedsLogin(true)
        setSubscriptionError('Your sign-in has expired. Please log in again to check your subscription.')
      } else if (status !== 404) {
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
      subscriptionNeedsLogin,
    }),
    [
      cancelSubscription,
      getSubscription,
      isNotSubscribed,
      subscription,
      subscriptionError,
      subscriptionLoading,
      subscriptionNeedsLogin,
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
