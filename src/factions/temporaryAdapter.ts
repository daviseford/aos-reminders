import deepmerge from 'deepmerge'
import { TInitialArmy, TSubfactionArmy } from 'types/army'
import { TEntry } from 'types/data'
import {
  TItemDescription,
  TItemDescriptions,
  TItemKey,
  TObjWithEffects,
  TParentEffectsObjWithEffects,
} from './factionTypes'

type TAdapter = (subFaction: TItemDescription, subFactionName: string, FlavorType?: string) => TInitialArmy

/**
 * To see how a new data-structure army might feel in the UI as-is
 */
export const temporaryAdapter: TAdapter = (
  subFaction,
  subFactionName,
  FlavorType = 'Flavors'
): TSubfactionArmy => {
  const army: TSubfactionArmy = {
    AlliedUnits: mergeData(subFaction, 'allied_units'),
    Artifacts: mergeData(subFaction, 'artifacts'),
    Battalions: mergeData(subFaction, 'battalions'),
    BattleTraits: subFaction.effects,
    CommandAbilities: mergeData(subFaction, 'command_abilities'),
    CommandTraits: mergeData(subFaction, 'command_traits'),
    EndlessSpells: mergeData(subFaction, 'endless_spells'),
    Flavors: mergeData(subFaction, 'flavors'),
    FlavorType,
    MountTraits: mergeData(subFaction, 'mount_traits'),
    Prayers: mergeData(subFaction, 'prayers'),
    Scenery: mergeData(subFaction, 'scenery'),
    Spells: mergeData(subFaction, 'spells'),
    SubFaction: subFactionAdapter(subFaction, subFactionName),
    Triumphs: mergeData(subFaction, 'triumphs'),
    Units: mergeData(subFaction, 'units'),
  }

  return army
}

export const getAggregateArmy = (subFactions: TItemDescriptions, flavorType = 'Flavors'): TSubfactionArmy => {
  return Object.entries(subFactions).reduce((a, [key, value]) => {
    const b = temporaryAdapter(value, key, flavorType)
    return deepmerge(a, b)
  }, {} as TSubfactionArmy)
}

const subFactionAdapter = (subFaction: TItemDescription, name: string): TEntry => {
  const { mandatory = {}, effects = [] } = subFaction
  return { mandatory, effects, name }
}
const mergeData = (subFaction: TItemDescription, slice: TItemKey): TObjWithName[] => {
  const { available = {}, mandatory = {} } = subFaction
  const merged: TParentEffectsObjWithEffects[] = [...(available[slice] || []), ...(mandatory[slice] || [])]
  return mergeParentEffectObjs(merged)
}

type TObjWithName = TObjWithEffects & { name: string }

export const mergeParentEffectObjs = <T extends TParentEffectsObjWithEffects>(
  objs: T[]
): (TParentEffectsObjWithEffects & TObjWithName)[] => {
  return objs.reduce((a, obj) => {
    const arr = parentEffectObjConverter(obj)
    a = a.concat(arr)
    return a
  }, [] as (TParentEffectsObjWithEffects & TObjWithName)[])
}

export const parentEffectObjConverter = <T extends TParentEffectsObjWithEffects>(
  obj: T
): (T & TObjWithName)[] => {
  return Object.keys(obj).reduce((a, name) => {
    const entry = { ...obj[name], name }
    a.push(entry as T & TObjWithName)
    return a
  }, [] as (T & TObjWithName)[])
}
