import { TEffects } from 'types/data'
import { TSelectionTypes } from 'types/selections'

export type TObjWithEffects = object & { effects: TEffects[] }
export type TParentEffectsObjWithEffects = Record<string, TObjWithEffects>

// export type TSubFactionKeys = TSelectionTypes

// export type TSubFactionEntry = {
//   available?: TParentEffectsObjWithEffects[]
//   mandatory?: TParentEffectsObjWithEffects[]
// }

export type TSubFaction = {
  available?: Partial<Record<TSelectionTypes, TParentEffectsObjWithEffects[]>>
  mandatory?: Partial<Record<TSelectionTypes, TParentEffectsObjWithEffects[]>>
} & {
  effects: TEffects[]
}

export type TSubFactions = Record<string, TSubFaction>

// export type TNewFactionType = {
//   readonly factionName: TSupportedFaction
//   readonly GrandAlliance: TGrandAlliances

//   readonly AggregateArmy: TInitialArmy

//   readonly SubFactions: TSubFactions
//   readonly subFactionArmies: Record<string, TInitialArmy>
//   readonly subFactionKeys: string[]

//   readonly subFactionLabel: string
//   readonly flavorLabel: string
// }
