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
        <h5 className="card-title">
          {army.armyName ? `${army.armyName} - ` : ``}
          {titleCase(army.factionName)}
        </h5>
        <h6 className="card-subtitle mb-2 text-muted">ID: {army.id}</h6>
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
