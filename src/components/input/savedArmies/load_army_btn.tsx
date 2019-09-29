import React from 'react'
import { connect } from 'react-redux'
import { useSavedArmies } from 'context/useSavedArmies'
import { factionNames, selections, realmscape, army } from 'ducks'
import { getArmy } from 'utils/getArmy/getArmy'
import { logEvent } from 'utils/analytics'
import { TSupportedFaction } from 'meta/factions'
import { IArmy, TUnits } from 'types/army'
import { ISavedArmyFromApi } from 'types/savedArmy'
import { ISelections } from 'types/selections'
import { TAllySelectionStore } from 'types/store'

interface ILoadButtonProps {
  army: ISavedArmyFromApi
  setFactionName: (value: string | null) => void
  setRealmscape: (value: string | null) => void
  setRealmscapeFeature: (value: string | null) => void
  updateAllyArmies: (payload: { factionName: TSupportedFaction; Army: IArmy }[]) => void
  updateAllySelections: (payload: TAllySelectionStore) => void
  updateAllyUnits: (payload: { factionName: TSupportedFaction; units: TUnits }) => void
  updateSelections: (payload: ISelections) => void
}

const LoadButtonComponent: React.FC<ILoadButtonProps> = props => {
  const {
    army,
    setFactionName,
    setRealmscape,
    setRealmscapeFeature,
    updateAllyArmies,
    updateAllySelections,
    updateSelections,
  } = props

  const { setLoadedArmy } = useSavedArmies()

  const handleLoadClick = e => {
    e.preventDefault()

    logEvent(`LoadArmy`)

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
    setFactionName: factionNames.actions.setFactionName,
    setRealmscape: realmscape.actions.setRealmscape,
    setRealmscapeFeature: realmscape.actions.setRealmscapeFeature,
    updateAllyArmies: army.actions.updateAllyArmies,
    updateAllySelections: selections.actions.updateAllySelections,
    updateAllyUnits: selections.actions.updateAllyUnits,
    updateSelections: selections.actions.updateSelections,
  }
)(LoadButtonComponent)
