import { ICurrentArmy } from './army'

export interface ISavedArmy extends ICurrentArmy {
  armyName: string
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
