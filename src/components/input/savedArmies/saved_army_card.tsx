import React from 'react'
import { titleCase } from 'utils/titleCase'
import { useSubscription } from 'context/useSubscription'
import { LoadArmyBtn } from './load_army_btn'
import { ISavedArmyFromApi } from 'types/savedArmy'
import { SavedArmyTable } from './saved_army_table'

interface ISavedArmyCardProps {
  army: ISavedArmyFromApi
}

export const SavedArmyCard: React.FC<ISavedArmyCardProps> = props => {
  const { army } = props
  const { deleteSavedArmy } = useSubscription()

  const handleDeleteClick = e => {
    e.preventDefault()
    deleteSavedArmy(army.id)
    // TODO: Start a progress indicator until unmounted
    // TO show that we're deleting
  }

  // TODO Make the table stuff collapsable

  return (
    <div className="card">
      <div className="card-body">
        <CardTitle armyName={army.armyName} factionName={army.factionName} />
        <div>
          <SavedArmyTable army={army} />
        </div>
        <div className="d-flex justify-content-center">
          <LoadArmyBtn army={army} />
          <button className="btn btn-sm btn-danger mx-3" onClick={handleDeleteClick}>
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

interface ICardTitleProps {
  armyName: ISavedArmyFromApi['armyName']
  factionName: ISavedArmyFromApi['factionName']
}

const CardTitle = ({ armyName, factionName }: ICardTitleProps) => {
  const faction = titleCase(factionName)
  return (
    <h5 className="card-title">
      {armyName ? armyName : `Untitled`}
      {' - '}
      <span className="text-muted">{faction}</span>
    </h5>
  )
}
