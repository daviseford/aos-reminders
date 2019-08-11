import { TTurnWhen } from './phases'

export type TEntryProperties =
  | 'allegiance_ability'
  | 'artifact'
  | 'command_ability'
  | 'command_trait'
  | 'endless_spell'
  | 'spell'

export type IEntry = {
  [prop in TEntryProperties]?: boolean
} & {
  name: string
  effects: IEffects[]
}

export type IEffects = {
  [prop in TEntryProperties]?: boolean
} & {
  name: string
  desc: string
  tag?: string
  when: TTurnWhen[]
}

export interface IReminder {
  [key: string]: ITurnAction[]
}

export interface ITurnAction {
  condition: string
  desc: string
  name?: string
  tag?: string | false
  allegiance_ability?: boolean
  artifact?: boolean
  command_ability?: boolean
  command_trait?: boolean
  endless_spell?: boolean
  spell?: boolean
}
