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

  const mergedUnits = mergeAvailableMandatory(data.units)
  const mergedFlavors = mergeAvailableMandatory(data.flavors)

  console.log(mergedUnits)

  const initialArmy: IInitialArmy = {
    // SubFactions: newFaction.subFactions,
    AllegianceType: newFaction.flavorLabel,
    Allegiances: mergeAll(mergedFlavors),
    Units: mergeAll(mergedUnits),
  }

  return initialArmy
}

type TObjWithName = TObjWithEffects & { name: string }

const mergeAvailableMandatory = (entry?: TSubFactionEntry): TParentEffectsObjWithEffects[] => {
  if (!entry) return []
  const { available, mandatory } = entry
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
