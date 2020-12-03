import deepmerge from 'deepmerge'
import { TInitialArmy } from 'types/army'
import { TSelectionTypes } from 'types/selections'
import {
  TItemDescription,
  TItemDescriptions,
  TObjWithEffects,
  TParentEffectsObjWithEffects,
} from './factionTypes'

/**
 * To see how a new data-structure army might feel in the UI as-is
 */
export const temporaryAdapter = (subFaction: TItemDescription, FlavorType = 'Flavors'): TInitialArmy => {
  const initialArmy: TInitialArmy = {
    Artifacts: mergeData(subFaction, 'artifacts'),
    Battalions: mergeData(subFaction, 'battalions'),
    BattleTraits: subFaction.effects,
    CommandTraits: mergeData(subFaction, 'command_traits'),
    EndlessSpells: mergeData(subFaction, 'endless_spells'),
    Flavors: mergeData(subFaction, 'flavors'),
    FlavorType,
    Prayers: mergeData(subFaction, 'prayers'),
    Scenery: mergeData(subFaction, 'scenery'),
    Spells: mergeData(subFaction, 'spells'),
    Units: mergeData(subFaction, 'units'),
  }

  return initialArmy
}

export const getAggregateArmy = (subFactions: TItemDescriptions, flavorType = 'Flavors'): TInitialArmy => {
  return Object.values(subFactions).reduce((a, value) => {
    const b = temporaryAdapter(value, flavorType)
    return deepmerge(a, b)
  }, {} as TInitialArmy)
}

const mergeData = (subFaction: TItemDescription, slice: TSelectionTypes): TObjWithName[] => {
  const { available = {}, mandatory = {} } = subFaction
  const merged: TParentEffectsObjWithEffects[] = [...(available[slice] || []), ...(mandatory[slice] || [])]
  return mergeParentEffectObjs(merged)
}

type TObjWithName = TObjWithEffects & { name: string }

export const mergeParentEffectObjs = (objs: TParentEffectsObjWithEffects[]): TObjWithName[] => {
  return objs.reduce((a, obj) => {
    const arr = parentEffectObjConverter(obj)
    a = a.concat(arr)
    return a
  }, [] as TObjWithName[])
}

export const parentEffectObjConverter = (obj: TParentEffectsObjWithEffects): TObjWithName[] => {
  return Object.keys(obj).reduce((a, name) => {
    const entry = { ...obj[name], name }
    a.push(entry)
    return a
  }, [] as TObjWithName[])
}
