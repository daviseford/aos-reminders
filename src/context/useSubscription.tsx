import React, { useState, useCallback, useMemo } from 'react'
import { useAuth0 } from 'react-auth0-wrapper'
import { SubscriptionApi } from 'api/subscriptionApi'
import { ISubscription } from 'types/subscription'
import { isSubscriber, isActiveSubscriber, isCanceledSubscriber } from 'utils/subscriptionUtils'
import { setLocalFavorite } from 'utils/localStore'

const initialState = {
  isActive: false,
  isCanceled: false,
  isSubscribed: false,
  subscription: { id: '', userName: '', subscribed: false },
  subscriptionLoading: false,
}

interface ISubscriptionContext {
  cancelSubscription: () => Promise<void>
  getSubscription: () => Promise<void>
  isActive: boolean
  isCanceled: boolean
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
  const isCanceled = useMemo(() => isCanceledSubscriber(subscription), [subscription])

  const getSubscription = useCallback(async () => {
    if (!user) return setSubscription(initialState.subscription)

    try {
      setSubscriptionLoading(true)
      const response = await SubscriptionApi.getSubscription(user.email)
      const subscription: ISubscription = response.body
      setSubscription(subscription)
      setSubscriptionLoading(false)
    } catch (err) {
      if (err.statusCode === 501) {
        console.log(`${user.email} is not registered with the Subscription API`)
      } else {
        console.log(`There was an unexpected error retrieving ${user.email} from the Subscription API`)
        console.error(err)
      }
      setSubscription(initialState.subscription)
      setLocalFavorite(null)
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
