import { TTurnWhen } from './meta'

export interface IEffects {
  name?: string
  desc: string
  when: TTurnWhen[]
}

export interface ITurnAction {
  condition: string[]
  action: string
  name?: string
}

export interface IReminder {
  [key: string]: ITurnAction[]
}
