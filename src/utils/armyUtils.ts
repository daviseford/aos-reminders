import { ISavedArmy } from 'types/savedArmy'
import { IAllySelections } from 'types/selections'
import { TSupportedFaction, SUPPORTED_FACTIONS } from 'meta/factions'

export const armyHasEntries = (army: ISavedArmy) => {
  const { allySelections, realmscape_feature, realmscape, selections } = army

  if (Object.values(selections).some(x => x.length)) return true
  if (Object.values(allySelections).some(x => Object.values(x as IAllySelections).some(x => x.length)))
    return true
  if (realmscape || realmscape_feature) return true

  return false
}

/**
 * Prepare an army to be uploaded
 * @param army
 */
export const prepareArmy = (army: ISavedArmy, type: 'save' | 'update', include: string[] = []) => {
  const {
    armyName,
    allyFactionNames,
    allySelections,
    factionName,
    realmscape = null,
    realmscape_feature = null,
    selections,
  } = army

  const prepared = {
    armyName: armyName || 'Untitled',
    allyFactionNames,
    allySelections,
    factionName,
    realmscape_feature,
    realmscape,
    selections,
  }

  if (type === 'save') return prepared

  // Prepare for update
  return Object.keys(prepared).reduce((a, k) => {
    if (['factionName', 'armyName'].includes(k)) return a // Don't include these in army updates
    if (!include.length) a[k] = prepared[k] // If there's no include array, include everything
    if (include.includes(k)) a[k] = prepared[k] // If there is an include array, only include... included keys
    return a
  }, {})
}

export const isValidFactionName = (val: any): val is TSupportedFaction => {
  return val && SUPPORTED_FACTIONS.includes(val)
}
