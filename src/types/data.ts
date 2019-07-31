import { TTurnWhen } from './phases'

export interface IEntry {
  name: string
  effects: IEffects[]
  allegiance_ability?: boolean
  artifact?: boolean
  command_ability?: boolean
  command_trait?: boolean
  endless_spell?: boolean
  spell?: boolean
}

export interface IEffects {
  name: string
  desc: string
  tag?: string
  when: TTurnWhen[]
  allegiance_ability?: boolean
  artifact?: boolean
  command_ability?: boolean
  command_trait?: boolean
  endless_spell?: boolean
  spell?: boolean
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
  endless_spell?: boolean
  spell?: boolean
}
