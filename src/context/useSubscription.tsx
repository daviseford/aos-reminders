import React, { useState } from 'react'
import { useAuth0 } from 'react-auth0-wrapper'
import { SubscriptionApi } from 'api/subscriptionApi'
import { ISubscription } from 'types/subscription'
import { isSubscriber } from 'utils/subscriptionUtils'

const initialState = { subscribed: false }

interface ISubscriptionContext {
  subscription: ISubscription
  updateSubscription: () => void
  isSubscribed: boolean
}

const SubscriptionContext = React.createContext<ISubscriptionContext>({
  subscription: initialState,
  updateSubscription: () => null,
  isSubscribed: false,
})

type TProviderProps = { children: React.ReactNode }

const SubscriptionProvider = ({ children }: TProviderProps) => {
  const { user } = useAuth0()
  const [subscription, setSubscription] = useState(initialState)

  const updateSubscription = async () => {
    if (!user) return setSubscription(initialState)

    try {
      const response = await SubscriptionApi.getSubscription(user.email)
      const subscription: ISubscription = response.body
      setSubscription(subscription)
    } catch (err) {
      console.error(err)
      setSubscription(initialState)
    }
  }

  return (
    <SubscriptionContext.Provider
      value={{ subscription, updateSubscription, isSubscribed: isSubscriber(subscription) }}
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
