import { logIndividualSelection, logAllyFaction, logFactionSwitch } from 'utils/analytics'
import { titleCase } from 'utils/textUtils'
import { TLoadedArmy } from 'types/import'

/**
 * Logs all the pertinent details of a loaded army to Google Analytics
 * @param army
 */
export const logLoadedArmy = (army: TLoadedArmy) => {
  try {
    const {
      selections = [],
      allySelections = {},
      origin_realm = null,
      realmscape = null,
      realmscape_feature = null,
      factionName = null,
    } = army

    // Log the faction name
    if (factionName) logFactionSwitch(factionName)

    // Log each selection
    Object.keys(selections).forEach(key => {
      const trait = titleCase(key)
      selections[key].forEach((name: string) => logIndividualSelection(trait, name))
    })

    // Log each allied faction + selection
    Object.keys(allySelections).forEach(allyFactionName => {
      logAllyFaction(allyFactionName)
      const units: string[] = allySelections[allyFactionName].units || []
      units.forEach(name => logIndividualSelection('AlliedUnits', name))
    })

    // Log Realm information
    if (origin_realm) logIndividualSelection('Realm of Origin', origin_realm)
    if (realmscape) logIndividualSelection('Realm of Battle', realmscape)
    if (realmscape_feature) logIndividualSelection('Realm Feature', realmscape_feature)
  } catch (err) {
    console.error(err)
  }
}
