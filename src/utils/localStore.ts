import { store } from 'index'
import { selectors } from 'ducks'
import { TSupportedFaction } from 'meta/factions'
import { ICurrentArmy } from 'types/army'
import { ISavedArmyFromApi } from 'types/savedArmy'
import { IVisibilityStore } from 'types/store'
import { TThemeType } from 'types/theme'

const LOCAL_FAVORITE_KEY = 'favoriteFaction'
const LOCAL_SAVED_ARMIES_KEY = 'savedArmies'
const LOCAL_STORED_ARMY_KEY = 'storedArmy'
const LOCAL_THEME_KEY = 'theme'
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
    if (!storedArmy) return null
    return JSON.parse(storedArmy) as ICurrentArmy & { hiddenReminders: IVisibilityStore['reminders'] }
  },
  exists: () => {
    const storedArmy = LocalStoredArmy.get()
    return !!(storedArmy && Object.values(storedArmy.selections).some(x => x.length > 0))
  },
  set: () => {
    const state = store.getState()
    const currentArmy = selectors.getCurrentArmy(state)
    const hiddenReminders = selectors.getReminders(state)
    if (currentArmy) {
      localStorage.setItem(LOCAL_STORED_ARMY_KEY, JSON.stringify({ ...currentArmy, hiddenReminders }))
    }
  },
}

export const LocalTheme = {
  clear: () => localStorage.removeItem(LOCAL_THEME_KEY),
  get: () => localStorage.getItem(LOCAL_THEME_KEY) as TThemeType | null,
  set: (theme: TThemeType) => localStorage.setItem(LOCAL_THEME_KEY, theme),
}

export const LocalUserName = {
  clear: () => localStorage.removeItem(LOCAL_USERNAME_KEY),
  get: () => localStorage.getItem(LOCAL_USERNAME_KEY),
  set: (userName: string) => localStorage.setItem(LOCAL_USERNAME_KEY, userName),
}

export const LocalSavedArmies = {
  clear: () => localStorage.removeItem(LOCAL_SAVED_ARMIES_KEY),
  get: () => {
    const savedArmies = localStorage.getItem(LOCAL_SAVED_ARMIES_KEY)
    if (!savedArmies) return []
    return JSON.parse(savedArmies) as ISavedArmyFromApi[]
  },
  set: (savedArmies: ISavedArmyFromApi[]) => {
    localStorage.setItem(LOCAL_SAVED_ARMIES_KEY, JSON.stringify(savedArmies))
  },
}
