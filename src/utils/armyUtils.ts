import { SUPPORTED_FACTIONS, TSupportedFaction } from 'meta/factions'
import { ICurrentArmy } from 'types/army'
import { IImportedArmy } from 'types/import'
import { INote } from 'types/notes'
import { ISavedArmy } from 'types/savedArmy'
import { IAllySelections } from 'types/selections'
import { LocalReminderOrder } from 'utils/localStore'

export const armyHasEntries = (army: ISavedArmy | ICurrentArmy, notes: INote[]) => {
  const { allySelections, origin_realm, realmscape_feature, realmscape, selections } = army

  if (notes.length > 0) return true
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
    subFactionName = '',
    hiddenReminders = [],
    notes = [],
    orderedReminders = LocalReminderOrder.get(),
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
    subFactionName,
    hiddenReminders,
    notes,
    orderedReminders,
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
 * We don't store "extra" data (notes, ordering, visibility) with these payloads.
 * @param army
 */
export const prepareArmyForS3 = (army: ISavedArmy | IImportedArmy | ICurrentArmy): ICurrentArmy => {
  const {
    allyFactionNames = [],
    allySelections = {},
    factionName,
    subFactionName,
    origin_realm = null,
    realmscape = null,
    realmscape_feature = null,
    selections,
  } = army

  return {
    allyFactionNames,
    allySelections,
    factionName,
    subFactionName,
    origin_realm,
    realmscape_feature,
    realmscape,
    selections,
  }
}

export const isValidFactionName = (val: any): val is TSupportedFaction => {
  return val && SUPPORTED_FACTIONS.includes(val)
}
