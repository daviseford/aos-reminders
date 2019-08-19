import { TTurnWhen } from './phases'

export type TEntryProperties =
  | 'allegiance_ability'
  | 'artifact'
  | 'command_ability'
  | 'command_trait'
  | 'endless_spell'
  | 'scenery'
  | 'spell'
  | 'triumph'

export const ENTRY_PROPERTIES: TEntryProperties[] = [
  'allegiance_ability',
  'artifact',
  'command_ability',
  'command_trait',
  'endless_spell',
  'scenery',
  'spell',
  'triumph',
]

export type TEntry = {
  name: string
  effects: TEffects[]
} & {
  [prop in TEntryProperties]?: boolean
}

export type TEffects = {
  name: string
  desc: string
  tag?: string
  when: TTurnWhen[]
} & {
  [prop in TEntryProperties]?: boolean
}

export interface IReminder {
  [key: string]: TTurnAction[]
}

export type TTurnAction = {
  condition: string
  desc: string
  name?: string
  tag?: string | false
} & {
  [prop in TEntryProperties]?: boolean
}
