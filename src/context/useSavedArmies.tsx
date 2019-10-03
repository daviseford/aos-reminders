import React, { useState, useCallback } from 'react'
import { useAuth0 } from 'react-auth0-wrapper'
import { PreferenceApi } from 'api/preferenceApi'
import { ISavedArmy, ISavedArmyFromApi } from 'types/savedArmy'
import { ICurrentArmy } from 'types/army'
import { isEqual, sortBy } from 'lodash'
import { useSubscription } from './useSubscription'
import { isValidFactionName } from 'utils/armyUtils'
import { SubscriptionApi } from 'api/subscriptionApi'
import { TSupportedFaction } from 'meta/factions'
import { unTitleCase } from 'utils/textUtils'

type TLoadedArmy = { id: string; armyName: string } | null
type THasChanges = (currentArmy: ICurrentArmy) => { hasChanges: boolean; changedKeys: string[] }

interface ISavedArmiesContext {
  armyHasChanges: THasChanges
  deleteSavedArmy: (id: string) => Promise<void>
  favoriteFaction: TSupportedFaction | null
  getFavoriteFaction: () => Promise<void>
  loadedArmy: { id: string; armyName: string } | null
  loadSavedArmies: () => Promise<void>
  saveArmy: (army: ISavedArmy) => Promise<void>
  savedArmies: ISavedArmyFromApi[]
  setLoadedArmy: (army: TLoadedArmy) => void
  updateArmy: (id: string, data: { [key: string]: any }) => Promise<void>
  updateArmyName: (id: string, armyName: string) => Promise<void>
  updateFavoriteFaction: (factionName: string | null) => Promise<void>
}

const SavedArmiesContext = React.createContext<ISavedArmiesContext | void>(undefined)

const SavedArmiesProvider: React.FC = ({ children }) => {
  const { user } = useAuth0()
  const { subscription, isSubscribed } = useSubscription()
  const [savedArmies, setSavedArmies] = useState<ISavedArmyFromApi[]>([])
  const [loadedArmy, setLoadedArmy] = useState<TLoadedArmy>(null)
  const [favoriteFaction, setFavoriteArmy] = useState<TSupportedFaction | null>(null)

  const armyHasChanges: THasChanges = useCallback(
    currentArmy => {
      if (!loadedArmy || !currentArmy) return { hasChanges: false, changedKeys: [] }
      const original = savedArmies.find(x => x.id === loadedArmy.id) as ISavedArmyFromApi
      const { id, armyName, userName, createdAt, updatedAt, ...loaded } = original

      // This fixes an issue where the names are not in exactly the same order
      loaded.allyFactionNames = sortBy(loaded.allyFactionNames || [])
      currentArmy.allyFactionNames = sortBy(currentArmy.allyFactionNames || [])

      const hasChanges = !isEqual(currentArmy, loaded)

      const changedKeys = !hasChanges
        ? []
        : Object.keys(currentArmy).reduce(
            (a, key) => {
              if (!isEqual(currentArmy[key], loaded[key])) a.push(key)
              return a
            },
            [] as string[]
          )

      return { hasChanges, changedKeys }
    },
    [loadedArmy, savedArmies]
  )

  const loadSavedArmies = useCallback(async () => {
    if (!user) return setSavedArmies([])

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
        await loadSavedArmies()
        setLoadedArmy({ id: body.id, armyName: body.armyName })
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

  const updateArmy = useCallback(
    async (id: string, data: { [key: string]: any }) => {
      try {
        const payload = { ...data, userName: user.email }
        await PreferenceApi.updateItem(id, payload)
        await loadSavedArmies()
      } catch (err) {
        console.error(err)
      }
    },
    [loadSavedArmies, user]
  )

  const updateArmyName = useCallback(
    async (id: string, armyName: string) => {
      try {
        const payload = { armyName, userName: user.email }
        await PreferenceApi.updateItem(id, payload)
        await loadSavedArmies()
        if (loadedArmy) setLoadedArmy({ id, armyName })
      } catch (err) {
        console.error(err)
      }
    },
    [loadSavedArmies, user, loadedArmy]
  )

  const getFavoriteFaction = useCallback(async () => {
    try {
      const { body } = await SubscriptionApi.getFavoriteFaction(subscription.userName)
      if (body.favoriteFaction !== favoriteFaction) {
        console.log('Got a new favoriteFaction from the API: ' + body.favoriteFaction)
        setFavoriteArmy(body.favoriteFaction)
      }
    } catch (err) {
      console.error(err)
    }
  }, [favoriteFaction, subscription.userName])

  const updateFavoriteFaction = useCallback(
    async (faction: string | null) => {
      if (!isSubscribed || !subscription) return

      const factionName = faction ? unTitleCase(faction) : faction

      if (factionName !== null && !isValidFactionName(factionName)) return

      try {
        const payload = { id: subscription.id, userName: subscription.userName, factionName }
        await SubscriptionApi.updateFavoriteFaction(payload)
        console.log('Set favoriteFaction to: ' + factionName)
        setFavoriteArmy(factionName)
      } catch (err) {
        console.error(err)
      }
    },
    [subscription, isSubscribed]
  )

  return (
    <SavedArmiesContext.Provider
      value={{
        armyHasChanges,
        deleteSavedArmy,
        favoriteFaction,
        getFavoriteFaction,
        loadedArmy,
        loadSavedArmies,
        saveArmy,
        savedArmies,
        setLoadedArmy,
        updateArmy,
        updateArmyName,
        updateFavoriteFaction,
      }}
    >
      {children}
    </SavedArmiesContext.Provider>
  )
}

const useSavedArmies = () => {
  const context = React.useContext(SavedArmiesContext)
  if (context === undefined) {
    throw new Error('useSavedArmies must be used within a SavedArmiesProvider')
  }
  return context
}

export { SavedArmiesProvider, useSavedArmies }
