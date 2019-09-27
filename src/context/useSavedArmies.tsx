import React, { useState, useCallback } from 'react'
import { useAuth0 } from 'react-auth0-wrapper'
import sortBy from 'lodash/sortBy'
import isEqual from 'lodash/isEqual'
import { PreferenceApi } from 'api/preferenceApi'
import { ISavedArmy, ISavedArmyFromApi } from 'types/savedArmy'
import { ICurrentArmy } from 'types/army'

type TLoadedArmy = { id: string; armyName: string } | null

const initialState = {
  armyHasChanges: (currentArmy: ICurrentArmy) => false,
  deleteSavedArmy: (id: string) => null,
  loadedArmy: null,
  loadSavedArmies: () => null,
  saveArmy: (army: ISavedArmy) => null,
  savedArmies: [] as ISavedArmyFromApi[],
  setLoadedArmy: (army: TLoadedArmy) => null,
  updateArmy: (id: string, data: { [key: string]: any }) => null,
}

interface ISavedArmiesContext {
  armyHasChanges: (currentArmy: ICurrentArmy) => boolean
  deleteSavedArmy: (id: string) => void
  loadedArmy: { id: string; armyName: string } | null
  loadSavedArmies: () => void
  saveArmy: (army: ISavedArmy) => void
  savedArmies: ISavedArmyFromApi[]
  setLoadedArmy: (army: TLoadedArmy) => void
  updateArmy: (id: string, data: { [key: string]: any }) => void
}

const SavedArmiesContext = React.createContext<ISavedArmiesContext>(initialState)

const SavedArmiesProvider: React.FC = ({ children }) => {
  const { user } = useAuth0()
  const [savedArmies, setSavedArmies] = useState(initialState.savedArmies)
  const [loadedArmy, setLoadedArmy] = useState<TLoadedArmy>(initialState.loadedArmy)
  console.log(loadedArmy)

  const armyHasChanges: (currentArmy: ICurrentArmy) => boolean = useCallback(
    currentArmy => {
      if (!loadedArmy) return false
      const original = savedArmies.find(x => x.id === loadedArmy.id) as ISavedArmyFromApi
      const { id, armyName, userName, createdAt, updatedAt, ...loaded } = original
      return !isEqual(currentArmy, loaded)
    },
    [loadedArmy, savedArmies]
  )

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

  const updateArmy = useCallback(
    async (id: string, data: { [key: string]: any }) => {
      try {
        const payload = { ...data, userName: user.email }
        const res = await PreferenceApi.updateItem(id, payload)
        console.log(res)
        await loadSavedArmies()
      } catch (err) {
        console.error(err)
      }
    },
    [loadSavedArmies, user]
  )

  return (
    <SavedArmiesContext.Provider
      value={{
        armyHasChanges,
        deleteSavedArmy,
        loadedArmy,
        loadSavedArmies,
        saveArmy,
        savedArmies,
        setLoadedArmy,
        updateArmy,
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
