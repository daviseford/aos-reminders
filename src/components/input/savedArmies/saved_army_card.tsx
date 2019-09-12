import React from 'react'
import { titleCase } from 'utils/textUtils'
import { useSubscription } from 'context/useSubscription'
import { LoadArmyBtn } from './load_army_btn'
import { ISavedArmyFromApi } from 'types/savedArmy'
import { SavedArmyTable } from './saved_army_table'
import { DateTime } from 'luxon'

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
    <div className="col-12 col-lg-6 col-xl-4 mb-2">
      <div className="card">
        <div className="card-body">
          <CardTitle armyName={army.armyName} factionName={army.factionName} createdAt={army.createdAt} />
          <div className="mt-1">
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
    </div>
  )
}

interface ICardTitleProps {
  armyName: ISavedArmyFromApi['armyName']
  factionName: ISavedArmyFromApi['factionName']
  createdAt: ISavedArmyFromApi['createdAt']
}

const CardTitle = ({ armyName, factionName, createdAt }: ICardTitleProps) => {
  const faction = titleCase(factionName)
  const created = DateTime.fromMillis(createdAt).toLocaleString({
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })

  return (
    <>
      <h5 className="card-title mb-0">
        {armyName ? armyName : `Untitled`}
        {' - '}
        <span className="text-muted">{faction}</span>
      </h5>
      <small className="text-muted">Created: {created}</small>
    </>
  )
}
