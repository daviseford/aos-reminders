import React, { useState, useCallback, useEffect } from 'react'
import { isEqual, sortBy } from 'lodash'
import { useAuth0 } from 'react-auth0-wrapper'
import { store } from 'index'
import { useAppStatus } from 'context/useAppStatus'
import { useSubscription } from 'context/useSubscription'
import { PreferenceApi } from 'api/preferenceApi'
import { SubscriptionApi } from 'api/subscriptionApi'
import { logEvent } from 'utils/analytics'
import { isValidFactionName, prepareArmy, prepareArmyForS3 } from 'utils/armyUtils'
import { addArmyToStore } from 'utils/loadArmy/loadArmyHelpers'
import { LocalUserName, LocalFavoriteFaction, LocalSavedArmies, LocalLoadedArmy } from 'utils/localStore'
import { unTitleCase } from 'utils/textUtils'
import { isDev } from 'utils/env'
import { TSupportedFaction } from 'meta/factions'
import { ISavedArmy, ISavedArmyFromApi } from 'types/savedArmy'
import { ICurrentArmy } from 'types/army'
import { IImportedArmy } from 'types/import'

type TLoadedArmy = { id: string; armyName: string } | null
type THasChanges = (currentArmy: ICurrentArmy) => { hasChanges: boolean; changedKeys: string[] }

interface ISavedArmiesContext {
  armyHasChanges: THasChanges
  deleteSavedArmy: (id: string) => Promise<void>
  favoriteFaction: TSupportedFaction | null
  getFavoriteFaction: () => Promise<void>
  loadedArmy: { id: string; armyName: string } | null
  loadSavedArmies: () => Promise<void>
  reloadArmy: () => void
  saveArmy: (army: ISavedArmy) => Promise<void>
  saveArmyToS3: (army: IImportedArmy | ISavedArmy | ICurrentArmy) => Promise<void>
  savedArmies: ISavedArmyFromApi[]
  saveLink: (army: ISavedArmy) => Promise<string | null>
  setLoadedArmy: (army: TLoadedArmy) => void
  updateArmy: (id: string, data: { [key: string]: any }) => Promise<void>
  updateArmyName: (id: string, armyName: string) => Promise<void>
  updateFavoriteFaction: (factionName: string | null) => Promise<void>
}

const saveArmyToS3 = async (army: IImportedArmy | ISavedArmy | ICurrentArmy) => {
  try {
    const preparedArmy = prepareArmyForS3(army)
    await PreferenceApi.saveArmyToS3(preparedArmy)
  } catch (err) {
    console.error(err)
  }
}

const SavedArmiesContext = React.createContext<ISavedArmiesContext | void>(undefined)

const SavedArmiesProvider: React.FC = ({ children }) => {
  const { isOffline } = useAppStatus()
  const { user } = useAuth0()
  const { subscription, isActive } = useSubscription()
  const [savedArmies, setSavedArmies] = useState<ISavedArmyFromApi[]>([])
  const [savedArmiesPopulated, setSavedArmiesPopulated] = useState(false)
  const [loadedArmy, setLoadedArmyState] = useState<TLoadedArmy>(LocalLoadedArmy.get())
  const [favoriteFaction, setFavoriteFaction] = useState<TSupportedFaction | null>(null)
  const [waitingForApi, setWaitingForApi] = useState(false)

  const setLoadedArmy = (army: TLoadedArmy) => {
    LocalLoadedArmy.set(army)
    setLoadedArmyState(army)
  }

  const armyHasChanges: THasChanges = useCallback(
    currentArmy => {
      const noChanges = { hasChanges: false, changedKeys: [] }
      if (!loadedArmy || !currentArmy || !savedArmiesPopulated) return noChanges

      const original = savedArmies.find(x => x.id === loadedArmy.id) as ISavedArmyFromApi
      if (!original) {
        setLoadedArmy(null)
        return noChanges
      }
      const { id, armyName, userName, createdAt, updatedAt, ...loaded } = original

      const hiddenReminders = store.getState().visibility.reminders
      currentArmy = prepareArmy({ ...currentArmy, hiddenReminders, armyName }, 'update') as ISavedArmy

      // This fixes an issue where the names are not in exactly the same order
      loaded.allyFactionNames = sortBy(loaded.allyFactionNames || [])
      currentArmy.allyFactionNames = sortBy(currentArmy.allyFactionNames || [])

      // Since origin_realm was introduced later, sometimes it's undefined in saved armies
      loaded.origin_realm = loaded.origin_realm || null

      const changedKeys = Object.keys(currentArmy).reduce((a, key) => {
        if (!isEqual(currentArmy[key], loaded[key])) a.push(key)
        return a
      }, [] as string[])

      if (changedKeys.length && isDev) console.log('Changed keys are: ', changedKeys)

      return { hasChanges: changedKeys.length > 0, changedKeys }
    },
    [loadedArmy, savedArmies, savedArmiesPopulated]
  )

  const loadSavedArmies = useCallback(async () => {
    if (isOffline) {
      setSavedArmiesPopulated(true)
      return setSavedArmies(LocalSavedArmies.get()) // If we're offline, fetch any saved armies from localStorage
    }
    if (!user) {
      setSavedArmiesPopulated(false)
      return setSavedArmies([])
    }

    try {
      const res = await PreferenceApi.getUserItems(user.email)
      const savedArmies = sortBy(res.body as ISavedArmyFromApi[], 'createdAt').reverse()
      setSavedArmies(savedArmies)
      LocalSavedArmies.set(savedArmies)
      setSavedArmiesPopulated(true)
    } catch (err) {
      console.error(err)
      setSavedArmiesPopulated(false)
    }
  }, [user, isOffline])

  const saveArmy = useCallback(
    async (savedArmy: ISavedArmy) => {
      try {
        const { body } = await PreferenceApi.createSavedArmy({ userName: user.email, ...savedArmy })
        saveArmyToS3(savedArmy)
        await loadSavedArmies()
        setLoadedArmy({ id: body.id, armyName: body.armyName })
      } catch (err) {
        console.error(err)
      }
    },
    [user, loadSavedArmies]
  )

  const saveLink = useCallback(async (savedArmy: ISavedArmy) => {
    try {
      const { body } = await PreferenceApi.createLink(savedArmy)
      saveArmyToS3(savedArmy)
      return body.url
    } catch (err) {
      console.error(err)
      return null
    }
  }, [])

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

  const reloadArmy = useCallback(() => {
    if (!loadedArmy) return
    const fullLoadedArmy = savedArmies.find(x => x.id === loadedArmy.id) as ISavedArmyFromApi
    addArmyToStore(fullLoadedArmy)
    logEvent(`ReloadArmy-${fullLoadedArmy.factionName}`)
  }, [loadedArmy, savedArmies])

  const getFavoriteFaction = useCallback(async () => {
    try {
      if (waitingForApi) return
      // If we don't have a favoriteFaction currently set, check if we have it in localStorage (much faster than the API request)
      const localFavorite = LocalFavoriteFaction.get()
      if (!favoriteFaction && localFavorite) {
        setFavoriteFaction(localFavorite)
      }

      if (isActive) {
        // Grab it from the API to check for changes that may have been made from other browsers
        // Don't update state if it's the same as our localStorage value
        const { body } = await SubscriptionApi.getFavoriteFaction(subscription.userName)
        const apiFavoriteFaction = body.favoriteFaction || null
        if (apiFavoriteFaction !== favoriteFaction && apiFavoriteFaction !== localFavorite) {
          LocalFavoriteFaction.set(apiFavoriteFaction)
          setFavoriteFaction(apiFavoriteFaction)
        }
      }
    } catch (err) {
      console.error(err)
    }
  }, [favoriteFaction, subscription, waitingForApi, isActive])

  const updateFavoriteFaction = useCallback(
    async (faction: string | null) => {
      if (!subscription || !isActive) return

      const factionName = faction ? unTitleCase(faction) : faction

      if (!isValidFactionName(factionName)) return

      try {
        // Update local storage
        setWaitingForApi(true)
        LocalFavoriteFaction.set(factionName)
        setFavoriteFaction(factionName)

        // Update API
        const payload = { id: subscription.id, userName: subscription.userName, factionName }
        await SubscriptionApi.updateFavoriteFaction(payload)
        logEvent(`FavoriteFaction-${factionName}`)
        setWaitingForApi(false)
      } catch (err) {
        console.error(err)
        setWaitingForApi(false)
      }
    },
    [subscription, isActive]
  )

  useEffect(() => {
    if (user && isActive) LocalUserName.set(user.email)
  }, [user, isActive])

  return (
    <SavedArmiesContext.Provider
      value={{
        armyHasChanges,
        deleteSavedArmy,
        favoriteFaction,
        getFavoriteFaction,
        loadedArmy,
        loadSavedArmies,
        reloadArmy,
        saveArmy,
        saveArmyToS3,
        savedArmies,
        saveLink,
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
