import { IInitialArmy } from 'types/army'
import { TObjWithEffects, TParentEffectsObjWithEffects } from './factionTypes'
import { SlaaneshFaction } from './slaanesh'

/**
 * To see how a new data-structure army might feel in the UI as-is
 */
export const temporaryAdapter = <F extends typeof SlaaneshFaction>(
  newFaction: F,
  whichSubFaction: Extract<keyof F['subFactions'], string>
): IInitialArmy => {
  const thisSubFactionsData = newFaction.subFactions[whichSubFaction]

  const Units = mergeAll(thisSubFactionsData.units || [])
  const Allegiances = mergeAll(thisSubFactionsData.flavors || [])

  const initialArmy: IInitialArmy = {
    AllegianceType: newFaction.flavorLabel,
    Allegiances,
    Units,
  }

  return initialArmy
}

type TObjWithName = TObjWithEffects & { name: string }

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
