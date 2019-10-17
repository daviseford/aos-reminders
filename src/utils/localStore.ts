import { TSupportedFaction } from 'meta/factions'
import { ICurrentArmy } from 'types/army'
import { selectors } from 'ducks'
import { store } from 'index'
import { ISavedArmyFromApi } from 'types/savedArmy'

const LOCAL_FAVORITE_KEY = 'favoriteFaction'
const LOCAL_SAVED_ARMIES_KEY = 'savedArmies'
const LOCAL_STORED_ARMY_KEY = 'storedArmy'
const LOCAL_USERNAME_KEY = 'userName'

export const hideNotificationBanner = (name: string) => localStorage.setItem(name, 'hidden')
export const getNotificationBanner = (name: string) => localStorage.getItem(name)

export const LocalFavoriteFaction = {
  clear: () => localStorage.removeItem(LOCAL_FAVORITE_KEY),
  get: () => localStorage.getItem(LOCAL_FAVORITE_KEY) as TSupportedFaction | null,
  set: (factionName: TSupportedFaction) => localStorage.setItem(LOCAL_FAVORITE_KEY, factionName),
}

export const LocalStoredArmy = {
  clear: () => localStorage.removeItem(LOCAL_STORED_ARMY_KEY),
  get: () => {
    const storedArmy = localStorage.getItem(LOCAL_STORED_ARMY_KEY)
    return !storedArmy ? null : (JSON.parse(storedArmy) as ICurrentArmy)
  },
  exists: () => {
    const storedArmy = LocalStoredArmy.get()
    return !!(storedArmy && Object.values(storedArmy.selections).some(x => x.length > 0))
  },
  set: () => {
    const currentArmy = selectors.getCurrentArmy(store.getState())
    if (currentArmy) {
      localStorage.setItem(LOCAL_STORED_ARMY_KEY, JSON.stringify(currentArmy))
    }
  },
}

export const LocalUserName = {
  clear: () => localStorage.removeItem(LOCAL_USERNAME_KEY),
  get: () => localStorage.getItem(LOCAL_USERNAME_KEY),
  set: (userName: string) => localStorage.setItem(LOCAL_USERNAME_KEY, userName),
}

export const setLocalSavedArmies = (armies: ISavedArmyFromApi[]) => {
  localStorage.setItem(LOCAL_SAVED_ARMIES_KEY, JSON.stringify(armies))
}
