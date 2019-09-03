import React, { useState, useCallback, useMemo } from 'react'
import { useAuth0 } from 'react-auth0-wrapper'
import { SubscriptionApi } from 'api/subscriptionApi'
import { ISubscription } from 'types/subscription'
import { isSubscriber } from 'utils/subscriptionUtils'
import { ISavedArmy, ISavedArmyFromApi } from 'types/savedArmy'
import { PreferenceApi } from 'api/preferenceApi'
import { sortBy } from 'lodash'

const initialState = {
  deleteSavedArmy: (id: string) => null,
  getSubscription: () => null,
  isSubscribed: false,
  loadSavedArmies: () => null,
  saveArmy: (army: ISavedArmy) => null,
  savedArmies: [] as ISavedArmyFromApi[],
  subscription: { subscribed: false },
  subscriptionLoading: false,
}

interface ISubscriptionContext {
  deleteSavedArmy: (id: string) => void
  getSubscription: () => void
  isSubscribed: boolean
  loadSavedArmies: () => void
  saveArmy: (army: ISavedArmy) => void
  savedArmies: ISavedArmyFromApi[]
  subscription: ISubscription
  subscriptionLoading: boolean
}

const SubscriptionContext = React.createContext<ISubscriptionContext>(initialState)

type TProviderProps = { children: React.ReactNode }

const SubscriptionProvider = ({ children }: TProviderProps) => {
  const { user } = useAuth0()
  const [subscription, setSubscription] = useState<ISubscription>(initialState.subscription)
  const [subscriptionLoading, setSubscriptionLoading] = useState(initialState.subscriptionLoading)
  const [savedArmies, setSavedArmies] = useState(initialState.savedArmies)

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

  const loadSavedArmies = useCallback(async () => {
    if (!user) return setSavedArmies(initialState.savedArmies)

    try {
      const res = await PreferenceApi.getUserItems(user.email)
      const savedArmies = sortBy(res.body as ISavedArmyFromApi[], 'createdAt').reverse()

      console.log(`loaded ${savedArmies.length} saved armies`)
      setSavedArmies(savedArmies)
    } catch (err) {
      console.log(err)
    }
  }, [user])

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

  console.log('loading useSubscription')

  return (
    <SubscriptionContext.Provider
      value={{
        deleteSavedArmy,
        getSubscription,
        isSubscribed,
        loadSavedArmies,
        saveArmy,
        savedArmies,
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
