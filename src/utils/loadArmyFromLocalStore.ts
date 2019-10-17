import { store } from 'index'
import { logEvent } from './analytics'
import { factionNames, army, selections, realmscape } from 'ducks'
import { getArmy } from './getArmy/getArmy'
import { LocalStoredArmy } from './localStore'
import { isDev } from './env'
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
  store.dispatch(realmscape.actions.setRealmscape(storedArmy.realmscape))
  store.dispatch(realmscape.actions.setRealmscapeFeature(storedArmy.realmscape_feature))

  LocalStoredArmy.clear()

  logEvent(`LoadArmyFromStore-${storedArmy.factionName}`)
}
