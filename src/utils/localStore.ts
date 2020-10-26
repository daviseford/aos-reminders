import { TSupportedFaction } from 'meta/factions'
import { TTurnWhen } from 'types/phases'
import { ISavedArmyFromApi } from 'types/savedArmy'
import { TThemeType } from 'types/theme'

const LOCAL_FAVORITE_KEY = 'favoriteFaction'
const LOCAL_LOADED_ARMY_KEY = 'loadedArmy'
const LOCAL_REDEMPTION_KEY = 'redeem'
const LOCAL_REMINDER_ORDER = 'reminderOrder'
const LOCAL_SAVED_ARMIES_KEY = 'savedArmies'
const LOCAL_THEME_KEY = 'theme'
const LOCAL_USERNAME_KEY = 'userName'

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

type TLoadedArmy = { id: string; armyName: string } | null

export const LocalLoadedArmy = {
  get: () => {
    const loadedArmy = localStorage.getItem(LOCAL_LOADED_ARMY_KEY)
    if (!loadedArmy) return null
    return JSON.parse(loadedArmy)
  },
  set: (loadedArmy: TLoadedArmy) => {
    loadedArmy
      ? localStorage.setItem(LOCAL_LOADED_ARMY_KEY, JSON.stringify(loadedArmy))
      : localStorage.removeItem(LOCAL_LOADED_ARMY_KEY)
  },
}

interface IGetAll {
  byId: {
    [id: string]: Record<string, string[]>
  }
  current: Record<string, string[]>
}

export const LocalReminderOrder = {
  clear: () => localStorage.setItem(LOCAL_REMINDER_ORDER, JSON.stringify({ byId: {}, current: {} })),
  get: (armyId?: string): Record<string, string[]> => {
    const str = localStorage.getItem(LOCAL_REMINDER_ORDER)
    if (!str) return {}
    const reminders = JSON.parse(str) as IGetAll
    if (!armyId) return reminders.current || {}
    return reminders.byId?.[armyId] || {}
  },
  getAll: (): IGetAll => {
    const str = localStorage.getItem(LOCAL_REMINDER_ORDER)
    if (!str) return { byId: {}, current: {} }
    const parsed = JSON.parse(str) as IGetAll
    return parsed
  },
  getWhen: (when: TTurnWhen): string[] => {
    const existingReminders = LocalReminderOrder.get()
    return existingReminders[when] || []
  },
  setByWhen: (when: TTurnWhen, ids: string[]): void => {
    const existingData = LocalReminderOrder.getAll()

    const newData = {
      current: {
        ...(existingData.current || {}),
        [when]: ids,
      },
      byId: existingData.byId || {},
    }

    localStorage.setItem(LOCAL_REMINDER_ORDER, JSON.stringify(newData))
  },

  setById: (armyId: string, orderedReminders?: Record<string, string[]>): void => {
    const existingData = LocalReminderOrder.getAll()

    const newData = {
      current: existingData.current,
      byId: {
        ...(existingData?.byId || {}),
        [armyId]: orderedReminders || {},
      },
    }

    localStorage.setItem(LOCAL_REMINDER_ORDER, JSON.stringify(newData))
  },

  makeIdActive: (armyId: string): void => {
    const dataFromId = LocalReminderOrder.get(armyId)
    console.log('making active', dataFromId)

    const newData = {
      current: dataFromId,
      byId: LocalReminderOrder.getAll().byId,
    }

    localStorage.setItem(LOCAL_REMINDER_ORDER, JSON.stringify(newData))
  },
}
