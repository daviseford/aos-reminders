import { PreferenceApi } from 'api/preferenceApi'
import {
  armyActions,
  factionNamesActions,
  realmscapeActions,
  selectionActions,
  visibilityActions,
} from 'ducks'
import { store } from 'store'
import { IArmy } from 'types/army'
import { TLoadedArmy } from 'types/import'
import { ILinkedArmy } from 'types/savedArmy'
import { logEvent, logLoadedArmy } from 'utils/analytics'
import { getArmy } from 'utils/getArmy/getArmy'

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

export const addArmyToStore = (loadedArmy: TLoadedArmy) => {
  try {
    store.dispatch(factionNamesActions.setFactionName(loadedArmy.factionName))

    // Add Ally Game data to the store
    if (loadedArmy.allyFactionNames.length) {
      const armies = loadedArmy.allyFactionNames.map(factionName => {
        const Army = getArmy(factionName) as IArmy
        return { factionName, Army }
      })
      store.dispatch(armyActions.updateAllyArmies(armies))
    }

    // Add our unit selections to the store
    store.dispatch(selectionActions.updateSelections(loadedArmy.selections))

    // Add our allied unit selections to the store
    store.dispatch(selectionActions.updateAllySelections(loadedArmy.allySelections))

    // Add Realm info to the store
    store.dispatch(realmscapeActions.setOriginRealm(loadedArmy.origin_realm || null))
    store.dispatch(realmscapeActions.setRealmscape(loadedArmy.realmscape || null))
    store.dispatch(realmscapeActions.setRealmscapeFeature(loadedArmy.realmscape_feature || null))

    // Hide any reminders necessary
    if (loadedArmy.hiddenReminders) {
      store.dispatch(visibilityActions.clearReminder())
      store.dispatch(visibilityActions.addReminders(loadedArmy.hiddenReminders))
    }

    // Log our army to GA
    logLoadedArmy(loadedArmy)
  } catch (err) {
    console.error(err)
  }
}
