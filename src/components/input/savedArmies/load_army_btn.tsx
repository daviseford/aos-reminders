import React from 'react'
import { connect } from 'react-redux'
import { useSavedArmies } from 'context/useSavedArmies'
import { factionNames, selections, realmscape, army, visibility } from 'ducks'
import { getArmy } from 'utils/getArmy/getArmy'
import { logEvent } from 'utils/analytics'
import { TSupportedFaction } from 'meta/factions'
import { IArmy } from 'types/army'
import { ISavedArmyFromApi } from 'types/savedArmy'
import { ISelections } from 'types/selections'
import { TAllySelectionStore } from 'types/store'
import { useAppStatus } from 'context/useAppStatus'

interface ILoadButtonProps {
  army: ISavedArmyFromApi
  addReminders: (values: string[]) => void
  clearReminder: () => void
  setFactionName: (value: string | null) => void
  setRealmscape: (value: string | null) => void
  setRealmscapeFeature: (value: string | null) => void
  updateAllyArmies: (payload: { factionName: TSupportedFaction; Army: IArmy }[]) => void
  updateAllySelections: (payload: TAllySelectionStore) => void
  updateSelections: (payload: ISelections) => void
}

const LoadButtonComponent: React.FC<ILoadButtonProps> = props => {
  const {
    addReminders,
    army,
    clearReminder,
    setFactionName,
    setRealmscape,
    setRealmscapeFeature,
    updateAllyArmies,
    updateAllySelections,
    updateSelections,
  } = props

  const { isOnline } = useAppStatus()
  const { setLoadedArmy } = useSavedArmies()

  const handleLoadClick = async e => {
    e.preventDefault()

    if (isOnline) logEvent(`LoadArmy-${army.factionName}`)

    setLoadedArmy({ id: army.id, armyName: army.armyName })
    setFactionName(army.factionName)

    // Add Ally Game data to the store
    if (army.allyFactionNames.length) {
      const armies = army.allyFactionNames.map(factionName => {
        const Army = getArmy(factionName) as IArmy
        return { factionName, Army }
      })
      updateAllyArmies(armies)
    }

    updateSelections(army.selections)
    updateAllySelections(army.allySelections)
    setRealmscape(army.realmscape)
    setRealmscapeFeature(army.realmscape_feature)

    // Hide any reminders necessary
    if (army.hiddenReminders) {
      clearReminder()
      addReminders(army.hiddenReminders)
    }
  }

  return (
    <button className="btn btn-sm btn-primary mx-3" onClick={handleLoadClick}>
      Load Army
    </button>
  )
}

export const LoadArmyBtn = connect(
  null,
  {
    addReminders: visibility.actions.addReminders,
    clearReminder: visibility.actions.clearReminder,
    setFactionName: factionNames.actions.setFactionName,
    setRealmscape: realmscape.actions.setRealmscape,
    setRealmscapeFeature: realmscape.actions.setRealmscapeFeature,
    updateAllyArmies: army.actions.updateAllyArmies,
    updateAllySelections: selections.actions.updateAllySelections,
    updateSelections: selections.actions.updateSelections,
  }
)(LoadButtonComponent)
