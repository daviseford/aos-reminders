import React, { useState, useCallback, useMemo } from 'react'
import { useAuth0 } from 'react-auth0-wrapper'
import { SubscriptionApi } from 'api/subscriptionApi'
import { ISubscription } from 'types/subscription'
import { isSubscriber, isActiveSubscriber } from 'utils/subscriptionUtils'
import { ISavedArmy, ISavedArmyFromApi } from 'types/savedArmy'
import { PreferenceApi } from 'api/preferenceApi'
import { sortBy } from 'lodash'

type TLoadedArmy = { id: string; armyName: string } | null

const initialState = {
  cancelSubscription: () => null,
  deleteSavedArmy: (id: string) => null,
  getSubscription: () => null,
  isActive: false,
  isSubscribed: false,
  loadedArmy: null,
  loadSavedArmies: () => null,
  saveArmy: (army: ISavedArmy) => null,
  savedArmies: [] as ISavedArmyFromApi[],
  setLoadedArmy: (army: TLoadedArmy) => null,
  subscription: { subscribed: false },
  subscriptionLoading: false,
}

interface ISubscriptionContext {
  cancelSubscription: () => void
  deleteSavedArmy: (id: string) => void
  getSubscription: () => void
  isActive: boolean
  isSubscribed: boolean
  loadedArmy: { id: string; armyName: string } | null
  loadSavedArmies: () => void
  saveArmy: (army: ISavedArmy) => void
  savedArmies: ISavedArmyFromApi[]
  setLoadedArmy: (army: TLoadedArmy) => void
  subscription: ISubscription
  subscriptionLoading: boolean
}

const SubscriptionContext = React.createContext<ISubscriptionContext>(initialState)

const SubscriptionProvider: React.FC = ({ children }) => {
  const { user } = useAuth0()
  const [subscription, setSubscription] = useState<ISubscription>(initialState.subscription)
  const [subscriptionLoading, setSubscriptionLoading] = useState(initialState.subscriptionLoading)
  const [savedArmies, setSavedArmies] = useState(initialState.savedArmies)
  const [loadedArmy, setLoadedArmy] = useState<TLoadedArmy>(initialState.loadedArmy)
  console.log(loadedArmy)

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

  const loadSavedArmies = useCallback(async () => {
    if (!user) return setSavedArmies(initialState.savedArmies)

    try {
      const res = await PreferenceApi.getUserItems(user.email)
      const savedArmies = sortBy(res.body as ISavedArmyFromApi[], 'createdAt').reverse()
      setSavedArmies(savedArmies)
    } catch (err) {
      console.error(err)
    }
  }, [user])

  const saveArmy = useCallback(
    async (savedArmy: ISavedArmy) => {
      try {
        const { body } = await PreferenceApi.createSavedArmy({ userName: user.email, ...savedArmy })
        setLoadedArmy({ id: body.id, armyName: body.armyName })
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
        if (loadedArmy && loadedArmy.id === id) setLoadedArmy(null)
        await loadSavedArmies()
      } catch (err) {
        console.error(err)
      }
    },
    [loadSavedArmies, user, loadedArmy]
  )

  return (
    <SubscriptionContext.Provider
      value={{
        cancelSubscription,
        deleteSavedArmy,
        getSubscription,
        isActive,
        isSubscribed,
        loadedArmy,
        loadSavedArmies,
        saveArmy,
        savedArmies,
        setLoadedArmy,
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
