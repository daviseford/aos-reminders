import React from 'react'
import { connect } from 'react-redux'
import { titleCase } from 'utils/titleCase'
import { deleteSavedArmyFromApi } from 'api/thunks'
import { savedArmies } from 'ducks'
import { LoadArmyBtn } from './load_army_btn'
import { ISavedArmyFromApi } from 'types/savedArmy'

interface ISavedArmyCardProps {
  army: ISavedArmyFromApi
  deleteArmy: (id: string, userName: string) => void
}

const SavedArmyCardComponent: React.FC<ISavedArmyCardProps> = props => {
  const { army, deleteArmy } = props

  const handleDeleteClick = e => {
    e.preventDefault()
    deleteSavedArmyFromApi(army, deleteArmy)
  }

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">{titleCase(army.factionName)}</h5>
        <h6 className="card-subtitle mb-2 text-muted">ID: {army.id}</h6>
        <p className="card-text">
          Some quick example text to build on the card title and make up the bulk of the card's content.
        </p>
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

export const SavedArmyCard = connect(
  null,
  {
    deleteArmy: savedArmies.actions.deleteSavedArmy,
  }
)(SavedArmyCardComponent)
