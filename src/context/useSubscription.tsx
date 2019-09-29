import React, { useState, useCallback, useMemo } from 'react'
import { useAuth0 } from 'react-auth0-wrapper'
import { SubscriptionApi } from 'api/subscriptionApi'
import { ISubscription } from 'types/subscription'
import { isSubscriber, isActiveSubscriber } from 'utils/subscriptionUtils'

const initialState = {
  isActive: false,
  isSubscribed: false,
  subscription: { subscribed: false },
  subscriptionLoading: false,
}

interface ISubscriptionContext {
  cancelSubscription: () => Promise<void>
  getSubscription: () => Promise<void>
  isActive: boolean
  isSubscribed: boolean
  subscription: ISubscription
  subscriptionLoading: boolean
}

const SubscriptionContext = React.createContext<ISubscriptionContext | void>(undefined)

const SubscriptionProvider: React.FC = ({ children }) => {
  const { user } = useAuth0()
  const [subscription, setSubscription] = useState<ISubscription>(initialState.subscription)
  const [subscriptionLoading, setSubscriptionLoading] = useState(initialState.subscriptionLoading)

  const isActive = useMemo(() => isActiveSubscriber(subscription), [subscription])
  const isSubscribed = useMemo(() => isSubscriber(subscription), [subscription])

  const getSubscription = useCallback(async () => {
    if (!user) return setSubscription(initialState.subscription)

    try {
      setSubscriptionLoading(true)
      const response = await SubscriptionApi.getSubscription(user.email)
      const subscription: ISubscription = response.body
      setSubscription(subscription)
      setSubscriptionLoading(false)
    } catch (err) {
      console.error(err)
      setSubscription(initialState.subscription)
      setSubscriptionLoading(false)
    }
  }, [user])

  const cancelSubscription = useCallback(async () => {
    try {
      await SubscriptionApi.cancelSubscription(subscription.subscriptionId as string)
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
