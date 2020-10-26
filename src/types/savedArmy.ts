import { ICurrentArmy } from 'types/army'
import { IVisibilityStore } from 'types/store'

export interface ISavedArmy extends ICurrentArmy {
  armyName: string
  hiddenReminders?: IVisibilityStore['reminders']
  orderedReminders?: Record<string, string[]>
}

export interface ISavedArmyFromApi extends ISavedArmy {
  id: string
  userName: string
  /**
   * Unix time (milliseconds)
   */
  createdAt: number
  /**
   * Unix time (milliseconds)
   */
  updatedAt: number
}

export interface ILinkedArmy extends ISavedArmy {
  id: string
  /**
   * Unix time (milliseconds)
   */
  createdAt: number
  /**
   * Unix time (milliseconds)
   */
  updatedAt: number
  hiddenReminders: IVisibilityStore['reminders']
}
