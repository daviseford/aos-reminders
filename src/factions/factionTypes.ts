import { TEffects } from 'types/data'

export type TObjWithEffects = object & { effects: TEffects[] }
export type TParentEffectsObjWithEffects = Record<string, TObjWithEffects>

export type TSubFaction = {
  units?: TParentEffectsObjWithEffects[]
  battalions?: TParentEffectsObjWithEffects[]
  traits?: TParentEffectsObjWithEffects[]
  spells?: TParentEffectsObjWithEffects[]
  battle_traits?: TParentEffectsObjWithEffects[]
  command_traits?: TParentEffectsObjWithEffects[]
  flavors?: TParentEffectsObjWithEffects[]
  artifacts?: TParentEffectsObjWithEffects[]
  endless_spells?: TParentEffectsObjWithEffects[]
  scenery?: TParentEffectsObjWithEffects[]
}

export type TSubFactions = Record<string, TSubFaction>
