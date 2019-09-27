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
export const prepareArmy = (army: ISavedArmy, type: 'save' | 'update') => {
  const {
    armyName,
    allyFactionNames,
    allySelections,
    factionName,
    realmscape = null,
    realmscape_feature = null,
    selections,
  } = army

  let prepared = {
    allyFactionNames,
    allySelections,
    realmscape_feature,
    realmscape,
    selections,
  }

  if (type === 'update') return prepared
  return { ...prepared, armyName: armyName || 'Untitled', factionName }
}

export const isValidFactionName = (val: any): val is TSupportedFaction => {
  return val && SUPPORTED_FACTIONS.includes(val)
}
