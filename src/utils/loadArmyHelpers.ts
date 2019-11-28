import { store } from 'index'
import { PreferenceApi } from 'api/preferenceApi'
import { factionNames, army, selections, realmscape, visibility } from 'ducks'
import { logEvent, logIndividualSelection, logAllyFaction, logFactionSwitch } from 'utils/analytics'
import { getArmy } from 'utils/getArmy/getArmy'
import { LocalStoredArmy } from 'utils/localStore'
import { IArmy, ICurrentArmy } from 'types/army'
import { ILinkedArmy, ISavedArmyFromApi } from 'types/savedArmy'
import { IImportedArmy } from 'types/import'
import { titleCase } from './textUtils'

export const loadArmyFromLink = async (id: string) => {
  try {
    const res = await PreferenceApi.getLinkedArmy(id)
    const linkedArmy = res.body as ILinkedArmy

    if (!linkedArmy) return

    addArmyToStore(linkedArmy)

    logEvent(`LoadArmyLink-${id}`)
    logEvent(`LoadArmyFromLink-${linkedArmy.factionName}`)
  } catch (err) {
    console.error(err)
  }
}

export const loadArmyFromLocalStore = () => {
  const storedArmy = LocalStoredArmy.get()

  if (!storedArmy) return

  addArmyToStore(storedArmy)

  LocalStoredArmy.clear()

  logEvent(`LoadArmyFromStore-${storedArmy.factionName}`)
}

type TLoadedArmy =
  | ISavedArmyFromApi
  | IImportedArmy
  | ILinkedArmy
  | (ICurrentArmy & { hiddenReminders: string[] })

export const addArmyToStore = (loadedArmy: TLoadedArmy) => {
  try {
    store.dispatch(factionNames.actions.setFactionName(loadedArmy.factionName))

    // Add Ally Game data to the store
    if (loadedArmy.allyFactionNames.length) {
      const armies = loadedArmy.allyFactionNames.map(factionName => {
        const Army = getArmy(factionName) as IArmy
        return { factionName, Army }
      })
      store.dispatch(army.actions.updateAllyArmies(armies))
    }

    // Add our unit selections to the store
    store.dispatch(selections.actions.updateSelections(loadedArmy.selections))

    // Add our allied unit selections to the store
    store.dispatch(selections.actions.updateAllySelections(loadedArmy.allySelections))

    // Add Realm info to the store
    store.dispatch(realmscape.actions.setOriginRealm(loadedArmy.origin_realm || null))
    store.dispatch(realmscape.actions.setRealmscape(loadedArmy.realmscape || null))
    store.dispatch(realmscape.actions.setRealmscapeFeature(loadedArmy.realmscape_feature || null))

    // Hide any reminders necessary
    if (loadedArmy.hiddenReminders) {
      store.dispatch(visibility.actions.clearReminder())
      store.dispatch(visibility.actions.addReminders(loadedArmy.hiddenReminders))
    }

    // Log our army to GA
    logLoadedArmy(loadedArmy)
  } catch (err) {
    console.error(err)
  }
}

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
