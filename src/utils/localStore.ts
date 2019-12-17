import { TSupportedFaction } from 'meta/factions'
import { ISavedArmyFromApi } from 'types/savedArmy'
import { TThemeType } from 'types/theme'

const LOCAL_FAVORITE_KEY = 'favoriteFaction'
const LOCAL_SAVED_ARMIES_KEY = 'savedArmies'
const LOCAL_THEME_KEY = 'theme'
const LOCAL_USERNAME_KEY = 'userName'
const LOCAL_REDEMPTION_KEY = 'redeem'

export const hideNotificationBanner = (name: string) => localStorage.setItem(name, 'hidden')
export const getNotificationBanner = (name: string) => localStorage.getItem(name)

export const LocalRedemptionKey = {
  clear: () => localStorage.removeItem(LOCAL_REDEMPTION_KEY),
  get: () => {
    const obj = localStorage.getItem(LOCAL_REDEMPTION_KEY)
    if (!obj) return null
    return JSON.parse(obj) as { giftId: string; userId: string }
  },
  set: (giftId: string, userId: string) => {
    const obj = JSON.stringify({ giftId, userId })
    localStorage.setItem(LOCAL_REDEMPTION_KEY, obj)
  },
}

export const LocalFavoriteFaction = {
  clear: () => localStorage.removeItem(LOCAL_FAVORITE_KEY),
  get: () => localStorage.getItem(LOCAL_FAVORITE_KEY) as TSupportedFaction | null,
  set: (factionName: TSupportedFaction) => localStorage.setItem(LOCAL_FAVORITE_KEY, factionName),
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
