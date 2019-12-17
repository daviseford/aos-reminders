import { store } from 'index'
import { PreferenceApi } from 'api/preferenceApi'
import { factionNames, army, selections, realmscape, visibility } from 'ducks'
import { logEvent, logLoadedArmy } from 'utils/analytics'
import { getArmy } from 'utils/getArmy/getArmy'
import { IArmy } from 'types/army'
import { TLoadedArmy } from 'types/import'
import { ILinkedArmy } from 'types/savedArmy'

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
