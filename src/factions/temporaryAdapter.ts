import deepmerge from 'deepmerge'
import { TInitialArmy } from 'types/army'
import {
  TObjWithEffects,
  TParentEffectsObjWithEffects,
  TSubFaction,
  TSubFactionEntry,
  TSubFactions,
} from './factionTypes'

/**
 * To see how a new data-structure army might feel in the UI as-is
 */
export const temporaryAdapter = (subFaction: TSubFaction, FlavorType = 'Flavors'): TInitialArmy => {
  const initialArmy: TInitialArmy = {
    Artifacts: mergeData(subFaction.artifacts),
    Battalions: mergeData(subFaction.battalions),
    BattleTraits: subFaction.effects,
    CommandTraits: mergeData(subFaction.command_traits),
    EndlessSpells: mergeData(subFaction.endless_spells),
    Flavors: mergeData(subFaction.flavors),
    FlavorType,
    Scenery: mergeData(subFaction.scenery),
    Spells: mergeData(subFaction.spells),
    Units: mergeData(subFaction.units),
  }

  return initialArmy
}

export const getAggregateArmy = (subFactions: TSubFactions, flavorType = 'Flavors'): TInitialArmy => {
  return Object.values(subFactions).reduce((a, value) => {
    const b = temporaryAdapter(value, flavorType)
    return deepmerge(a, b)
  }, {} as TInitialArmy)
}

const mergeData = (entry?: TSubFactionEntry) => {
  const merged = mergeAvailableMandatory(entry)
  return mergeAll(merged)
}

type TObjWithName = TObjWithEffects & { name: string }

const mergeAvailableMandatory = (entry?: TSubFactionEntry): TParentEffectsObjWithEffects[] => {
  if (!entry) return []
  const { available = [], mandatory = [] } = entry
  return [...available, ...mandatory]
}

const mergeAll = (objs: TParentEffectsObjWithEffects[]): TObjWithName[] => {
  return objs.reduce((a, obj) => {
    const arr = toArr(obj)
    a = a.concat(arr)
    return a
  }, [] as TObjWithName[])
}

const toArr = (obj: TParentEffectsObjWithEffects): TObjWithName[] => {
  return Object.keys(obj).reduce((a, name) => {
    const entry = { ...obj[name], name }
    a.push(entry)
    return a
  }, [] as TObjWithName[])
}
