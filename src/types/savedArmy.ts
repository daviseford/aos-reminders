import { ICurrentArmy } from './army'
import { IVisibilityStore } from './store'

export interface ISavedArmy extends ICurrentArmy {
  armyName: string
  hiddenReminders?: IVisibilityStore['reminders']
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
