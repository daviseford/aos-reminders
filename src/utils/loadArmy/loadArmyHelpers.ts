import { PreferenceApi } from 'api/preferenceApi'
import {
  armyActions,
  factionNamesActions,
  realmscapeActions,
  selectionActions,
  visibilityActions,
} from 'ducks'
import { notesActions } from 'ducks/notes'
import { store } from 'store'
import { IArmy } from 'types/army'
import { TLoadedArmy } from 'types/import'
import { ILinkedArmy, ISavedArmyFromApi } from 'types/savedArmy'
import { logEvent, logLoadedArmy } from 'utils/analytics'
import { getArmy } from 'utils/getArmy/getArmy'
import { LocalReminderOrder } from 'utils/localStore'

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
    const { dispatch } = store

    dispatch(factionNamesActions.setFactionName(loadedArmy.factionName))

    // Add Ally Game data to the store
    if (loadedArmy.allyFactionNames.length) {
      const armies = loadedArmy.allyFactionNames.map(factionName => {
        const Army = getArmy(factionName) as IArmy
        return { factionName, Army }
      })
      dispatch(armyActions.updateAllyArmies(armies))
    }

    // Add our unit selections to the store
    dispatch(selectionActions.setSelections(loadedArmy.selections))

    // Add our allied unit selections to the store
    dispatch(selectionActions.setAllySelections(loadedArmy.allySelections))

    // Add Realm info to the store
    dispatch(realmscapeActions.setOriginRealm(loadedArmy.origin_realm || null))
    dispatch(realmscapeActions.setRealmscape(loadedArmy.realmscape || null))
    dispatch(realmscapeActions.setRealmscapeFeature(loadedArmy.realmscape_feature || null))

    // Hide any reminders necessary
    if (loadedArmy.hiddenReminders) {
      dispatch(visibilityActions.clearReminders())
      dispatch(visibilityActions.addReminders(loadedArmy.hiddenReminders))
    }

    loadedArmy = loadedArmy as ISavedArmyFromApi

    // Add notes if necessary
    if (loadedArmy.notes) {
      dispatch(notesActions.setNotes(loadedArmy.notes))
    }

    // Re-organize reminder ordering if needed
    if ((loadedArmy as ISavedArmyFromApi).orderedReminders && (loadedArmy as ISavedArmyFromApi).id) {
      LocalReminderOrder.setById(loadedArmy.id, loadedArmy.orderedReminders)
      LocalReminderOrder.makeIdActive(loadedArmy.id)
    }

    // Log our army to GA
    logLoadedArmy(loadedArmy)
  } catch (err) {
    console.error(err)
  }
}
