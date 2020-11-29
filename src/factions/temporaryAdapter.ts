import { IInitialArmy } from 'types/army'
import { TObjWithEffects, TParentEffectsObjWithEffects, TSubFactionEntry } from './factionTypes'
import { SlaaneshFaction } from './slaanesh'

/**
 * To see how a new data-structure army might feel in the UI as-is
 */
export const temporaryAdapter = <F extends typeof SlaaneshFaction>(
  newFaction: F,
  whichSubFaction: Extract<keyof F['subFactions'], string>
): IInitialArmy => {
  const thisSubFactionsData = newFaction.subFactions[whichSubFaction]

  const mergedUnits = mergeAvailableMandatory(thisSubFactionsData.units)
  const mergedFlavors = mergeAvailableMandatory(thisSubFactionsData.flavors)

  const Units = mergeAll(mergedUnits)
  const Allegiances = mergeAll(mergedFlavors)

  const initialArmy: IInitialArmy = {
    AllegianceType: newFaction.flavorLabel,
    Allegiances,
    Units,
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
