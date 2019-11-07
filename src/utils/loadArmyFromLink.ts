import { store } from 'index'
import { logEvent } from './analytics'
import { factionNames, army, selections, realmscape, visibility } from 'ducks'
import { getArmy } from './getArmy/getArmy'
import { IArmy } from 'types/army'
import { PreferenceApi } from 'api/preferenceApi'
import { ILinkedArmy } from 'types/savedArmy'

export const loadArmyFromLink = async (id: string) => {
  const res = await PreferenceApi.getLinkedArmy(id)
  const linkedArmy = res.body as ILinkedArmy

  if (!linkedArmy) return

  store.dispatch(factionNames.actions.setFactionName(linkedArmy.factionName))

  // Add Ally Game data to the store
  if (linkedArmy.allyFactionNames.length) {
    const armies = linkedArmy.allyFactionNames.map(factionName => {
      const Army = getArmy(factionName) as IArmy
      return { factionName, Army }
    })
    store.dispatch(army.actions.updateAllyArmies(armies))
  }

  store.dispatch(selections.actions.updateSelections(linkedArmy.selections))
  store.dispatch(selections.actions.updateAllySelections(linkedArmy.allySelections))
  store.dispatch(realmscape.actions.setRealmscape(linkedArmy.realmscape))
  store.dispatch(realmscape.actions.setRealmscapeFeature(linkedArmy.realmscape_feature))

  // Hide any reminders necessary
  if (linkedArmy.hiddenReminders) {
    store.dispatch(visibility.actions.clearReminder())
    store.dispatch(visibility.actions.addReminders(linkedArmy.hiddenReminders))
  }

  logEvent(`LoadArmyLink-${id}`)
  logEvent(`LoadArmyFromLink-${linkedArmy.factionName}`)
}
