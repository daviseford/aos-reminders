import { IInitialArmy } from 'types/army'
import { TObjWithEffects, TParentEffectsObjWithEffects, TSubFactionEntry } from './factionTypes'
import { SlaaneshFaction } from './slaanesh'

/**
 * To see how a new data-structure army might feel in the UI as-is
 */
export const temporaryAdapter = <
  F extends typeof SlaaneshFaction,
  W extends Extract<keyof F['subFactions'], string>
>(
  newFaction: F,
  whichSubFaction: W
): IInitialArmy => {
  const data = newFaction.subFactions[whichSubFaction]

  const initialArmy: IInitialArmy = {
    Abilities: data.effects,
    Allegiances: mergeData(data.flavors),
    AllegianceType: newFaction.flavorLabel,
    Artifacts: mergeData(data.artifacts),
    Battalions: mergeData(data.battalions),
    EndlessSpells: mergeData(data.endless_spells),
    Scenery: mergeData(data.scenery),
    Spells: mergeData(data.spells),
    // SubFactions: newFaction.subFactions,
    Traits: mergeData(data.command_traits),
    Units: mergeData(data.units),
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
