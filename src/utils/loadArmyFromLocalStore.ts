import { store } from 'index'
import { factionNames, army, selections, realmscape, visibility } from 'ducks'
import { logEvent } from 'utils/analytics'
import { getArmy } from 'utils/getArmy/getArmy'
import { LocalStoredArmy } from 'utils/localStore'
import { isDev } from 'utils/env'
import { IArmy } from 'types/army'

export const loadArmyFromLocalStore = () => {
  const storedArmy = LocalStoredArmy.get()

  if (!storedArmy) return

  if (isDev) console.log('Loading army from localStorage', storedArmy)

  store.dispatch(factionNames.actions.setFactionName(storedArmy.factionName))

  // Add Ally Game data to the store
  if (storedArmy.allyFactionNames.length) {
    const armies = storedArmy.allyFactionNames.map(factionName => {
      const Army = getArmy(factionName) as IArmy
      return { factionName, Army }
    })
    store.dispatch(army.actions.updateAllyArmies(armies))
  }

  store.dispatch(selections.actions.updateSelections(storedArmy.selections))
  store.dispatch(selections.actions.updateAllySelections(storedArmy.allySelections))
  store.dispatch(realmscape.actions.setOriginRealm(storedArmy.origin_realm || null))
  store.dispatch(realmscape.actions.setRealmscape(storedArmy.realmscape))
  store.dispatch(realmscape.actions.setRealmscapeFeature(storedArmy.realmscape_feature))

  // Hide any reminders necessary
  if (storedArmy.hiddenReminders) {
    store.dispatch(visibility.actions.clearReminder())
    store.dispatch(visibility.actions.addReminders(storedArmy.hiddenReminders))
  }

  LocalStoredArmy.clear()

  logEvent(`LoadArmyFromStore-${storedArmy.factionName}`)
}
