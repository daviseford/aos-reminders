import { TEffects } from 'types/data'

export type TObjWithEffects = object & { effects: TEffects[] }
export type TParentEffectsObjWithEffects = Record<string, TObjWithEffects>

export type TSubFactionEntry = {
  available: TParentEffectsObjWithEffects[]
  mandatory: TParentEffectsObjWithEffects[]
}

export type TSubFaction = {
  units?: TSubFactionEntry
  battalions?: TSubFactionEntry
  traits?: TSubFactionEntry
  spells?: TSubFactionEntry
  battle_traits?: TSubFactionEntry
  command_traits?: TSubFactionEntry
  flavors?: TSubFactionEntry
  artifacts?: TSubFactionEntry
  endless_spells?: TSubFactionEntry
  scenery?: TSubFactionEntry
}

export type TSubFactions = Record<string, TSubFaction>
