import { TSubFactionEntry } from 'factions/factionTypes'
import { TTurnWhen } from 'types/phases'
import { TSelectionTypes } from './selections'

export type TEntryProperties =
  | 'artifact'
  | 'command_ability'
  | 'command_trait'
  | 'endless_spell'
  | 'mount_trait'
  | 'prayer'
  | 'scenery'
  | 'spell'
  | 'triumph'

export const ENTRY_PROPERTIES: TEntryProperties[] = [
  'artifact',
  'command_ability',
  'command_trait',
  'endless_spell',
  'mount_trait',
  'prayer',
  'scenery',
  'spell',
  'triumph',
]

type TEntry2 = {
  [prop in TEntryProperties]?: boolean
} &
  {
    [key in TSelectionTypes]?: TSubFactionEntry
  }

export type TEntry = {
  name: string
  effects: TEffects[]
  isSideEffect?: boolean
} & TEntry2

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
  id: string
  actionTitle?: string
  condition: string[]
  desc: string
  name: string
  when: TTurnWhen
  tag?: string | false
} & {
  [prop in TEntryProperties]?: boolean
}
