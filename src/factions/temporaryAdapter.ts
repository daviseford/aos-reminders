import { IInitialArmy } from 'types/army'
import { TNewFaction, TObjWithEffects, TParentEffectsObjWithEffects, TSubFactionEntry } from './factionTypes'

/**
 * To see how a new data-structure army might feel in the UI as-is
 */
export const temporaryAdapter = <F extends TNewFaction, W extends Extract<keyof F['subFactions'], string>>(
  newFaction: F,
  whichSubFaction: W
): IInitialArmy => {
  const subFaction = newFaction.subFactions[whichSubFaction]

  const initialArmy: IInitialArmy = {
    Abilities: subFaction.effects,
    Allegiances: mergeData(subFaction.flavors),
    AllegianceType: newFaction.flavorLabel,
    Artifacts: mergeData(subFaction.artifacts),
    Battalions: mergeData(subFaction.battalions),
    EndlessSpells: mergeData(subFaction.endless_spells),
    Scenery: mergeData(subFaction.scenery),
    Spells: mergeData(subFaction.spells),
    // SubFactions: newFaction.subFactions,
    Traits: mergeData(subFaction.command_traits),
    Units: mergeData(subFaction.units),
  }

  return initialArmy
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
