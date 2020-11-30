import { TSupportedFaction } from 'meta/factions'
import { TEffects } from 'types/data'

export type TObjWithEffects = object & { effects: TEffects[] }
export type TParentEffectsObjWithEffects = Record<string, TObjWithEffects>

export type TSubFactionKeys =
  | 'units'
  | 'battalions'
  | 'spells'
  | 'command_traits'
  | 'command_abilities'
  | 'flavors'
  | 'artifacts'
  | 'endless_spells'
  | 'scenery'

export type TSubFactionEntry = {
  available?: TParentEffectsObjWithEffects[]
  mandatory?: TParentEffectsObjWithEffects[]
}

export type TSubFaction = {
  [key in TSubFactionKeys]?: TSubFactionEntry
} & {
  effects: TEffects[]
}

export type TSubFactions = Record<string, TSubFaction>

export type TNewFaction = {
  factionName: TSupportedFaction

  subFactions: TSubFactions

  subFactionLabel: string
  flavorLabel: string
}
