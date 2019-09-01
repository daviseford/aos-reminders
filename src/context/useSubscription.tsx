import React, { useState, useCallback } from 'react'
import { useAuth0 } from 'react-auth0-wrapper'
import { SubscriptionApi } from 'api/subscriptionApi'
import { ISubscription } from 'types/subscription'
import { isSubscriber } from 'utils/subscriptionUtils'

const initialState = {
  subscription: { subscribed: false },
  updateSubscription: () => null,
  isSubscribed: false,
}

interface ISubscriptionContext {
  subscription: ISubscription
  updateSubscription: () => void
  isSubscribed: boolean
}

const SubscriptionContext = React.createContext<ISubscriptionContext>(initialState)

type TProviderProps = { children: React.ReactNode }

const SubscriptionProvider = ({ children }: TProviderProps) => {
  const { user } = useAuth0()
  const [subscription, setSubscription] = useState<ISubscription>(initialState.subscription)
  const isSubscribed = isSubscriber(subscription)

  const updateSubscription = useCallback(async () => {
    if (!user) return setSubscription(initialState.subscription)

    try {
      const response = await SubscriptionApi.getSubscription(user.email)
      const subscription: ISubscription = response.body
      setSubscription(subscription)
    } catch (err) {
      console.error(err)
      setSubscription(initialState.subscription)
    }
  }, [user])

  return (
    <SubscriptionContext.Provider value={{ subscription, updateSubscription, isSubscribed }}>
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
