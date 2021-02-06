import { IItemDescription } from 'factions/factionTypes'
import { TRuleSource } from 'meta/rule_sources'
import { TTurnWhen } from 'types/phases'
import { TCollection } from './army'
import { TSelectionTypes } from './selections'

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

export const lowerToUpperLookup: Record<TSelectionTypes, keyof TCollection> = {
  artifacts: 'Artifacts',
  battalions: 'Battalions',
  command_abilities: 'CommandAbilities',
  command_traits: 'CommandTraits',
  endless_spells: 'EndlessSpells',
  flavors: 'Flavors',
  mount_traits: 'MountTraits',
  prayers: 'Prayers',
  scenery: 'Scenery',
  spells: 'Spells',
  triumphs: 'Triumphs',
  units: 'Units',
}

export const upperToLowerLookup: Record<keyof TCollection, TSelectionTypes> = {
  Artifacts: 'artifacts',
  Battalions: 'battalions',
  CommandAbilities: 'command_abilities',
  CommandTraits: 'command_traits',
  EndlessSpells: 'endless_spells',
  Flavors: 'flavors',
  MountTraits: 'mount_traits',
  Prayers: 'prayers',
  Scenery: 'scenery',
  Spells: 'spells',
  Triumphs: 'triumphs',
  Units: 'units',
}

export const entryKeyToSelectionsKey: Record<Exclude<TEntryProperties, 'battle_trait'>, TSelectionTypes> = {
  artifact: 'artifacts',
  battalion: 'battalions',
  command_ability: 'command_abilities',
  command_trait: 'command_traits',
  endless_spell: 'endless_spells',
  mount_trait: 'mount_traits',
  prayer: 'prayers',
  scenery: 'scenery',
  spell: 'spells',
  triumph: 'triumphs',
  unit: 'units',
}

export const selectionsKeyToEntryKey: Record<
  Exclude<TSelectionTypes, 'battle_traits' | 'flavors'>,
  TEntryProperties
> = {
  artifacts: 'artifact',
  battalions: 'battalion',
  command_abilities: 'command_ability',
  command_traits: 'command_trait',
  endless_spells: 'endless_spell',
  mount_traits: 'mount_trait',
  prayers: 'prayer',
  scenery: 'scenery',
  spells: 'spell',
  triumphs: 'triumph',
  units: 'unit',
}

type TEntryMetadata = IItemDescription &
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
  when: TTurnWhen[]
  rule_sources?: TRuleSource[]
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
} & {
  [prop in TEntryProperties]?: boolean
}
