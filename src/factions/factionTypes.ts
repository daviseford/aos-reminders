import { TGrandAlliances } from 'meta/alliances'
import { TSupportedFaction } from 'meta/factions'
import { TInitialArmy } from 'types/army'
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

export type TNewFactionType = {
  factionName: TSupportedFaction

  subFactions: TSubFactions

  Army: TInitialArmy // THis is the aggregate army

  readonly subFactionKeys: string[]
  readonly subFactionLabel: string
  readonly flavorLabel: string

  readonly GrandAlliance: TGrandAlliances
}
