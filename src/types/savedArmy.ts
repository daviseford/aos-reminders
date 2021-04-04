import { ICurrentArmy } from 'types/army'
import { INote } from 'types/notes'
import { IVisibilityStore } from 'types/store'

export interface ISavedArmy extends ICurrentArmy {
  armyName: string
  hiddenReminders?: IVisibilityStore['reminders']
  orderedReminders?: Record<string, string[]>
  notes?: INote[]
}

export interface ISavedArmyFromApi extends ISavedArmy {
  id: string
  userName: string
  notes?: INote[]
  /**
   * Unix time (milliseconds)
   */
  createdAt: number
  /**
   * Unix time (milliseconds)
   */
  updatedAt: number
  schemaVersion: number
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
  notes: INote[]
  schemaVersion: number
}
