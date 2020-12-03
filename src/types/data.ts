import { TItemDescription } from 'factions/factionTypes'
import { TTurnWhen } from 'types/phases'

export type TEntryProperties =
  | 'artifact'
  | 'battalion'
  | 'battle_trait'
  | 'command_ability'
  | 'command_trait'
  | 'endless_spell'
  | 'mount_trait'
  | 'prayer'
  | 'scenery'
  | 'spell'
  | 'triumph'
  | 'unit'

export const ENTRY_PROPERTIES: TEntryProperties[] = [
  'artifact',
  'battalion',
  'battle_trait',
  'command_ability',
  'command_trait',
  'endless_spell',
  'mount_trait',
  'prayer',
  'scenery',
  'spell',
  'triumph',
  'unit',
]

type TEntryMetadata = TItemDescription &
  {
    [prop in TEntryProperties]?: boolean
  }
export type TEntry = {
  name: string
  isSideEffect?: boolean
} & TEntryMetadata

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
