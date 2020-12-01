import { TSupportedFaction } from 'meta/factions'
import { TEffects } from 'types/data'
import { TSelectionTypes } from 'types/selections'

export type TObjWithEffects = object & { effects: TEffects[] }
export type TParentEffectsObjWithEffects = Record<string, TObjWithEffects>

export type TSubFactionKeys = TSelectionTypes

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
