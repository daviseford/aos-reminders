import { SubscriptionApi } from 'api/subscriptionApi'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth0 } from 'react-auth0-wrapper'
import { IUseAuth0 } from 'types/auth0'
import { ISubscription } from 'types/subscription'
import { LocalFavoriteFaction } from 'utils/localStore'
import {
  isActiveSubscriber,
  isCanceledSubscriber,
  isGiftedSubscriber,
  isPaypal,
  isPendingSubscriber,
  isStripe,
  isSubscriber,
} from 'utils/subscriptionUtils'

const initialState = {
  createdByPaypal: false,
  createdByStripe: false,
  isActive: false,
  isCanceled: false,
  isGifted: false,
  isNotSubscribed: false,
  isPending: false,
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
   * If this subscription was created by Paypal,
   * there is a 30-60 time period after checkout before their subscription is confirmed.
   */
  isPending: boolean
  /**
   * Does this user exist in the subscription API?
   * This DOES NOT mean they have an active subscription
   */
  isSubscribed: boolean
  createdByPaypal: boolean
  createdByStripe: boolean
  subscription: ISubscription
  subscriptionLoading: boolean
}

const SubscriptionContext = React.createContext<ISubscriptionContext | void>(undefined)

const SubscriptionProvider: React.FC = ({ children }) => {
  const { user, loading }: IUseAuth0 = useAuth0()
  const [subscription, setSubscription] = useState<ISubscription>(initialState.subscription)
  const [subscriptionLoading, setSubscriptionLoading] = useState(initialState.subscriptionLoading)
  const [isNotSubscribed, setIsNotSubscribed] = useState(initialState.isNotSubscribed)

  const createdByPaypal = isPaypal(subscription)
  const createdByStripe = isStripe(subscription)
  const isActive = isActiveSubscriber(subscription)
  const isCanceled = isCanceledSubscriber(subscription)
  const isGifted = isGiftedSubscriber(subscription)
  const isPending = isPendingSubscriber(subscription)
  const isSubscribed = isSubscriber(subscription)

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

  const value = useMemo(
    () => ({
      cancelSubscription,
      createdByPaypal,
      createdByStripe,
      getSubscription,
      isActive,
      isCanceled,
      isGifted,
      isNotSubscribed,
      isPending,
      isSubscribed,
      subscription,
      subscriptionLoading,
    }),
    [
      cancelSubscription,
      createdByPaypal,
      createdByStripe,
      getSubscription,
      isActive,
      isCanceled,
      isGifted,
      isNotSubscribed,
      isPending,
      isSubscribed,
      subscription,
      subscriptionLoading,
    ]
  )

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>
}

const useSubscription = () => {
  const context = React.useContext(SubscriptionContext)
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider')
  }
  return context
}

export { SubscriptionProvider, useSubscription }
