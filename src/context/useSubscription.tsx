import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { useAuth0 } from 'react-auth0-wrapper'
import { SubscriptionApi } from 'api/subscriptionApi'
import { ISubscription } from 'types/subscription'
import {
  isSubscriber,
  isActiveSubscriber,
  isCanceledSubscriber,
  isGiftedSubscriber,
} from 'utils/subscriptionUtils'
import { LocalFavoriteFaction } from 'utils/localStore'

const initialState = {
  isActive: false,
  isCanceled: false,
  isGifted: false,
  isNotSubscribed: false,
  isSubscribed: false,
  subscription: { id: '', userName: '', subscribed: false },
  subscriptionLoading: false,
}

interface ISubscriptionContext {
  cancelSubscription: () => Promise<void>
  getSubscription: () => Promise<void>
  /**
   * Does this user have an active subscription?
   * A user who has cancelled their subscription, but is still in their subscription period
   * is still considered an active subscriber
   */
  isActive: boolean
  /**
   * Has this user cancelled recurring payments?
   */
  isCanceled: boolean
  /**
   * Was this subscription given as a gift?
   */
  isGifted: boolean
  /**
   * This value is only set AFTER Auth0 and the Subscription API have been contacted
   * Don't rely on it for immediate correctness on pageload
   */
  isNotSubscribed: boolean
  /**
   * Does this user exist in the subscription API?
   * This DOES NOT mean they have an active subscription
   */
  isSubscribed: boolean
  subscription: ISubscription
  subscriptionLoading: boolean
}

const SubscriptionContext = React.createContext<ISubscriptionContext | void>(undefined)

const SubscriptionProvider: React.FC = ({ children }) => {
  const { user, loading } = useAuth0()
  const [subscription, setSubscription] = useState<ISubscription>(initialState.subscription)
  const [subscriptionLoading, setSubscriptionLoading] = useState(initialState.subscriptionLoading)
  const [isNotSubscribed, setIsNotSubscribed] = useState(initialState.isNotSubscribed)

  const isActive = useMemo(() => isActiveSubscriber(subscription), [subscription])
  const isCanceled = useMemo(() => isCanceledSubscriber(subscription), [subscription])
  const isGifted = useMemo(() => isGiftedSubscriber(subscription), [subscription])
  const isSubscribed = useMemo(() => isSubscriber(subscription), [subscription])

  useEffect(() => {
    if (loading) return
    if (!user) setIsNotSubscribed(true)
  }, [loading, user])

  const getSubscription = useCallback(async () => {
    if (!user) return setSubscription(initialState.subscription)

    try {
      setSubscriptionLoading(true)
      const response = await SubscriptionApi.getSubscription(user.email)
      const subscription: ISubscription = response.body
      setSubscription(subscription)
      setSubscriptionLoading(false)
    } catch (err) {
      if (err.status === 501) {
        console.log(`${user.email} is not registered with the Subscription API`)
      } else {
        console.log(`There was an unexpected error retrieving ${user.email} from the Subscription API`)
        console.error(err)
      }
      setSubscription(initialState.subscription)
      LocalFavoriteFaction.clear()
      setIsNotSubscribed(true)
      setSubscriptionLoading(false)
    }
  }, [user])

  const cancelSubscription = useCallback(async () => {
    try {
      const { userName, subscriptionId = '' } = subscription
      await SubscriptionApi.cancelSubscription({ userName, subscriptionId })
      await getSubscription()
    } catch (err) {
      console.error(err)
    }
  }, [getSubscription, subscription])

  return (
    <SubscriptionContext.Provider
      value={{
        cancelSubscription,
        getSubscription,
        isActive,
        isCanceled,
        isGifted,
        isNotSubscribed,
        isSubscribed,
        subscription,
        subscriptionLoading,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  )
}

const useSubscription = () => {
  const context = React.useContext(SubscriptionContext)
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider')
  }
  return context
}

export { SubscriptionProvider, useSubscription }
