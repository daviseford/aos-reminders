import { TSupportedFaction } from 'meta/factions'
import { ICurrentArmy } from 'types/army'
import { isDev } from './env'

const STORED_ARMY_KEY = 'storedArmy'
const LOCAL_FAVORITE_KEY = 'favoriteFaction'

/**
 * Set the local favoriteFaction to a faction name
 * Or remove it from the local store by passing null
 * @param factionName
 */
export const setLocalFavorite = (factionName: TSupportedFaction | null) => {
  if (factionName) {
    localStorage.setItem(LOCAL_FAVORITE_KEY, factionName)
  } else {
    localStorage.removeItem(LOCAL_FAVORITE_KEY)
  }
}

export const getLocalFavorite = () => {
  const localFavorite = localStorage.getItem(LOCAL_FAVORITE_KEY) as TSupportedFaction | null
  return localFavorite
}

export const hideNotificationBanner = (name: string) => {
  localStorage.setItem(name, 'hidden')
}

export const getNotificationBanner = (name: string) => localStorage.getItem(name)

export const storeArmy = (currentArmy: ICurrentArmy) => {
  localStorage.setItem(STORED_ARMY_KEY, JSON.stringify(currentArmy))
}

export const clearStoredArmy = () => localStorage.removeItem(STORED_ARMY_KEY)

export const getStoredArmy = () => {
  const storedArmy = localStorage.getItem(STORED_ARMY_KEY)
  return !storedArmy ? null : (JSON.parse(storedArmy) as ICurrentArmy)
}

export const hasStoredArmy = () => {
  const storedArmy = getStoredArmy()
  if (storedArmy && Object.values(storedArmy.selections).some(x => x.length > 0)) {
    if (isDev) console.log('Has a locally stored army')
    return true
  }
  if (isDev) console.log('Does not have a locally stored army')
  return false
}
