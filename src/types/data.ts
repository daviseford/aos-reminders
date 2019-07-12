import { TTurnWhen } from './phases'

export interface IEntry {
  name: string
  effects: IEffects[]
  artifact?: boolean
  command_ability?: boolean
}

export interface IEffects {
  name: string
  desc: string
  when: TTurnWhen[]
  allegiance_ability?: boolean
  artifact?: boolean
  command_ability?: boolean
  tag?: string
}

export interface IReminder {
  [key: string]: ITurnAction[]
}

export interface ITurnAction {
  condition: string
  desc: string
  name?: string
  tag?: string
  allegiance_ability?: boolean
  artifact?: boolean
  command_ability?: boolean
  command_trait?: boolean
}
