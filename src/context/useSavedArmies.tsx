import { useAuth0 } from '@auth0/auth0-react'
import { PreferenceApi } from 'api/preferenceApi'
import { useAppStatus } from 'context/useAppStatus'
import { useSubscription } from 'context/useSubscription'
import { isEqual, sortBy } from 'lodash'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { store } from 'store'
import { ICurrentArmy } from 'types/army'
import { IImportedArmy } from 'types/import'
import { ISavedArmy, ISavedArmyFromApi } from 'types/savedArmy'
import { logEvent } from 'utils/analytics'
import { prepareArmy, prepareArmyForS3 } from 'utils/armyUtils'
import { isDev } from 'utils/env'
import useGetReminders from 'utils/hooks/useGetReminders'
import { addArmyToStore } from 'utils/loadArmy/loadArmyHelpers'
import { LocalLoadedArmy, LocalReminderOrder, LocalSavedArmies, LocalUserName } from 'utils/localStore'

type TLoadedArmy = { id: string; armyName: string } | null
type THasChanges = (currentArmy: ICurrentArmy) => { hasChanges: boolean; changedKeys: string[] }

interface ISavedArmiesContext {
  armyHasChanges: THasChanges
  deleteSavedArmy: (id: string) => Promise<void>
  loadedArmy: TLoadedArmy | null
  loadSavedArmies: () => Promise<void>
  reloadArmy: () => void
  saveArmy: (army: ISavedArmy) => Promise<void>
  saveArmyToS3: (army: IImportedArmy | ISavedArmy | ICurrentArmy) => Promise<void>
  savedArmies: ISavedArmyFromApi[]
  saveLink: (army: ISavedArmy) => Promise<string | null>
  setLoadedArmy: (army: TLoadedArmy) => void
  setHasOrderChanges: (hasChanged: boolean) => void
  updateArmy: (id: string, data: Record<string, unknown>) => Promise<void>
  updateArmyName: (id: string, armyName: string) => Promise<void>
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

const SavedArmiesProvider = ({ children }: React.PropsWithChildren<object>) => {
  const { isOffline } = useAppStatus()
  const { user } = useAuth0()
  const { relevantNotes } = useGetReminders()
  const { isActive } = useSubscription()
  const [savedArmies, setSavedArmies] = useState<ISavedArmyFromApi[]>([])
  const [savedArmiesPopulated, setSavedArmiesPopulated] = useState(false)
  const [loadedArmy, setLoadedArmyState] = useState<TLoadedArmy>(LocalLoadedArmy.get())
  const [hasOrderChanges, setHasOrderChanges] = useState(false)

  const setLoadedArmy = useCallback((army: TLoadedArmy) => {
    LocalLoadedArmy.set(army)
    setLoadedArmyState(army)
    if (army?.id) LocalReminderOrder.makeIdActive(army.id)
  }, [])

  const armyHasChanges: THasChanges = useCallback(
    currentArmy => {
      const noChangesResponse = { hasChanges: false, changedKeys: [] }
      if (!loadedArmy || !currentArmy || !savedArmiesPopulated) return noChangesResponse

      const original = savedArmies.find(x => x.id === loadedArmy.id) as ISavedArmyFromApi
      if (!original) {
        setLoadedArmy(null)
        return noChangesResponse
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, armyName, userName, createdAt, updatedAt, schemaVersion, ...loaded } = original

      const hiddenReminders = store.getState().visibility.reminders
      const current = prepareArmy(
        { ...currentArmy, hiddenReminders, armyName, notes: relevantNotes },
        'update'
      ) as ISavedArmy

      // This fixes an issue where the names are not in exactly the same order
      loaded.allyFactionNames = sortBy(loaded.allyFactionNames || [])
      current.allyFactionNames = sortBy(current.allyFactionNames || [])

      // Since origin_realm was introduced later, sometimes it's undefined in saved armies
      loaded.origin_realm = loaded.origin_realm || null

      // Have we updated our reminder ordering?
      loaded.orderedReminders = loaded.orderedReminders || LocalReminderOrder.get(loadedArmy.id)

      const changedKeys = Object.keys(current).reduce((a, key) => {
        if (!isEqual(current[key as keyof ISavedArmy], loaded[key as keyof typeof loaded])) a.push(key)
        return a
      }, [] as string[])

      if (changedKeys.length && isDev) console.log('Changed keys are: ', changedKeys)
      if (hasOrderChanges && isDev) console.log(`hasOrderChanges: ${hasOrderChanges}`)

      return { hasChanges: changedKeys.length > 0 || hasOrderChanges, changedKeys }
    },
    [hasOrderChanges, loadedArmy, relevantNotes, savedArmies, savedArmiesPopulated, setLoadedArmy]
  )

  const loadSavedArmies = useCallback(async () => {
    if (isOffline) {
      setSavedArmiesPopulated(true)
      return setSavedArmies(LocalSavedArmies.get()) // If we're offline, fetch any saved armies from localStorage
    }
    if (!user?.email) {
      setSavedArmiesPopulated(false)
      return setSavedArmies([])
    }

    try {
      const res = await PreferenceApi.getUserItems(user?.email)
      const savedArmies = sortBy(res.body as ISavedArmyFromApi[], 'createdAt').reverse()
      setSavedArmies(savedArmies)
      LocalSavedArmies.set(savedArmies)
      savedArmies.forEach(a => LocalReminderOrder.setById(a.id, a.orderedReminders))
      setSavedArmiesPopulated(true)
    } catch (err) {
      console.error(err)
      setSavedArmiesPopulated(false)
    }
  }, [user, isOffline])

  const saveArmy = useCallback(
    async (savedArmy: ISavedArmy) => {
      try {
        if (!user?.email) return
        setHasOrderChanges(false)
        const { body } = await PreferenceApi.createSavedArmy({ userName: user?.email, ...savedArmy })
        saveArmyToS3(savedArmy)
        await loadSavedArmies()
        setLoadedArmy({ id: body.id, armyName: body.armyName })
      } catch (err) {
        console.error(err)
      }
    },
    [user, loadSavedArmies, setLoadedArmy]
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
        if (!user?.email) return
        await PreferenceApi.deleteItem(id, user.email)
        if (loadedArmy && loadedArmy.id === id) setLoadedArmy(null)
        await loadSavedArmies()
      } catch (err) {
        console.error(err)
      }
    },
    [loadSavedArmies, user, loadedArmy, setLoadedArmy]
  )

  const updateArmy = useCallback(
    async (id: string, data: Record<string, unknown>) => {
      try {
        if (!user?.email) return
        setHasOrderChanges(false)
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
        if (!user?.email) return
        const payload = { armyName, userName: user.email }
        await PreferenceApi.updateItem(id, payload)
        await loadSavedArmies()
        if (loadedArmy) setLoadedArmy({ id, armyName })
      } catch (err) {
        console.error(err)
      }
    },
    [loadSavedArmies, user, loadedArmy, setLoadedArmy]
  )

  const reloadArmy = useCallback(() => {
    if (!loadedArmy) return
    const fullLoadedArmy = savedArmies.find(x => x.id === loadedArmy.id) as ISavedArmyFromApi
    addArmyToStore(fullLoadedArmy)
    logEvent(`ReloadArmy-${fullLoadedArmy.factionName}`)
  }, [loadedArmy, savedArmies])

  useEffect(() => {
    if (user?.email && isActive) LocalUserName.set(user.email)
  }, [user, isActive])

  const value = useMemo(
    () => ({
      armyHasChanges,
      deleteSavedArmy,
      loadedArmy,
      loadSavedArmies,
      reloadArmy,
      saveArmy,
      saveArmyToS3,
      savedArmies,
      saveLink,
      setHasOrderChanges,
      setLoadedArmy,
      updateArmy,
      updateArmyName,
    }),
    [
      armyHasChanges,
      deleteSavedArmy,
      loadedArmy,
      loadSavedArmies,
      reloadArmy,
      saveArmy,
      savedArmies,
      saveLink,
      setHasOrderChanges,
      setLoadedArmy,
      updateArmy,
      updateArmyName,
    ]
  )

  return <SavedArmiesContext.Provider value={value}>{children}</SavedArmiesContext.Provider>
}

const useSavedArmies = () => {
  const context = React.useContext(SavedArmiesContext)
  if (context === undefined) {
    throw new Error('useSavedArmies must be used within a SavedArmiesProvider')
  }
  return context
}

export { SavedArmiesProvider, useSavedArmies }
