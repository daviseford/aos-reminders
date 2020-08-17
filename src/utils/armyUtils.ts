import { SUPPORTED_FACTIONS, TSupportedFaction } from 'meta/factions'
import { ICurrentArmy } from 'types/army'
import { TEntry } from 'types/data'
import { IImportedArmy } from 'types/import'
import { ISavedArmy } from 'types/savedArmy'
import { IAllySelections } from 'types/selections'

export const armyHasEntries = (army: ISavedArmy) => {
  const { allySelections, origin_realm, realmscape_feature, realmscape, selections } = army

  if (Object.values(selections).some(x => x.length)) return true
  if (Object.values(allySelections).some(x => Object.values(x as IAllySelections).some(x => x.length)))
    return true
  if (origin_realm || realmscape || realmscape_feature) return true

  return false
}

/**
 * Prepare an army to be uploaded
 * @param army
 */
export const prepareArmy = (army: ISavedArmy, type: 'save' | 'update', include: string[] = []) => {
  const {
    allyFactionNames,
    allySelections,
    armyName,
    factionName,
    hiddenReminders = [],
    origin_realm = null,
    realmscape = null,
    realmscape_feature = null,
    selections,
  } = army

  const prepared = {
    allyFactionNames,
    allySelections,
    armyName: armyName || 'Untitled',
    factionName,
    hiddenReminders,
    origin_realm,
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

/**
 * Prepares an army to be uploaded to S3 for later analysis
 * @param army
 */
export const prepareArmyForS3 = (army: ISavedArmy | IImportedArmy | ICurrentArmy): ICurrentArmy => {
  const {
    allyFactionNames = [],
    allySelections = {},
    factionName,
    origin_realm = null,
    realmscape = null,
    realmscape_feature = null,
    selections,
  } = army

  return {
    allyFactionNames,
    allySelections,
    factionName,
    origin_realm,
    realmscape_feature,
    realmscape,
    selections,
  }
}

export const isValidFactionName = (val: any): val is TSupportedFaction => {
  return val && SUPPORTED_FACTIONS.includes(val)
}

// Appends a string to an entry
export const appendTag = (entry: TEntry, tag: string) => ({ ...entry, name: `${entry.name} (${tag})` })
