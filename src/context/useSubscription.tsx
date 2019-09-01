import React, { useState, useCallback } from 'react'
import { useAuth0 } from 'react-auth0-wrapper'
import { SubscriptionApi } from 'api/subscriptionApi'
import { ISubscription } from 'types/subscription'
import { isSubscriber } from 'utils/subscriptionUtils'
import { ISavedArmy, ISavedArmyFromApi } from 'types/savedArmy'
import { PreferenceApi } from 'api/preferenceApi'

const initialState = {
  subscription: { subscribed: false },
  updateSubscription: () => null,
  isSubscribed: false,
  savedArmies: [] as ISavedArmyFromApi[],
  saveArmy: (army: ISavedArmy) => null,
  loadSavedArmies: () => null,
  deleteSavedArmy: (id: string) => null,
}

interface ISubscriptionContext {
  subscription: ISubscription
  updateSubscription: () => void
  isSubscribed: boolean
  savedArmies: ISavedArmyFromApi[]
  saveArmy: (army: ISavedArmy) => void
  loadSavedArmies: () => void
  deleteSavedArmy: (id: string) => void
}

const SubscriptionContext = React.createContext<ISubscriptionContext>(initialState)

type TProviderProps = { children: React.ReactNode }

const SubscriptionProvider = ({ children }: TProviderProps) => {
  const { user, isAuthenticated } = useAuth0()
  const [subscription, setSubscription] = useState<ISubscription>(initialState.subscription)
  const [savedArmies, setSavedArmies] = useState(initialState.savedArmies)
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

  const loadSavedArmies = useCallback(async () => {
    if (!user || !isAuthenticated || !isSubscribed) return setSavedArmies(initialState.savedArmies)

    try {
      const res = await PreferenceApi.getUserItems(user.email)
      const savedArmies = res.body as ISavedArmyFromApi[]
      console.log(`loaded ${savedArmies.length} saved armies`)
      setSavedArmies(savedArmies)
    } catch (err) {
      console.log(err)
    }
  }, [user, isAuthenticated, isSubscribed])

  const saveArmy = useCallback(
    async (savedArmy: ISavedArmy) => {
      try {
        const payload = { userName: user.email, ...savedArmy }
        const res = await PreferenceApi.createSavedArmy(payload)
        const armyFromApi = res.body as ISavedArmyFromApi
        console.log(`created savedArmy named ${armyFromApi.armyName}, id: ${armyFromApi.id}`)
        await loadSavedArmies()
      } catch (err) {
        console.error(err)
      }
    },
    [user, loadSavedArmies]
  )

  const deleteSavedArmy = useCallback(
    async (id: string) => {
      try {
        await PreferenceApi.deleteItem(id, user.email)
        console.log(`deleted army id: ${id} for user ${user.email}`)
        await loadSavedArmies()
      } catch (err) {
        console.error(err)
      }
    },
    [loadSavedArmies, user]
  )

  console.log('ahhh')

  return (
    <SubscriptionContext.Provider
      value={{
        savedArmies,
        deleteSavedArmy,
        loadSavedArmies,
        saveArmy,
        subscription,
        updateSubscription,
        isSubscribed,
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
