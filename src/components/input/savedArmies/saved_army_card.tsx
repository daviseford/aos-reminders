import React, { useState } from 'react'
import { DateTime } from 'luxon'
import { useSavedArmies } from 'context/useSavedArmies'
import { titleCase } from 'utils/textUtils'
import { logEvent } from 'utils/analytics'
import { LoadArmyBtn } from './load_army_btn'
import { SavedArmyTable } from './saved_army_table'
import { DeleteArmyModal } from './delete_army_modal'
import { ISavedArmyFromApi } from 'types/savedArmy'

interface ISavedArmyCardProps {
  army: ISavedArmyFromApi
}

export const SavedArmyCard: React.FC<ISavedArmyCardProps> = props => {
  const { army } = props
  const { deleteSavedArmy } = useSavedArmies()

  const [modalIsOpen, setModalIsOpen] = useState(false)

  const openModal = () => setModalIsOpen(true)
  const closeModal = () => setModalIsOpen(false)

  const handleDeleteClick = e => {
    e.preventDefault()
    logEvent('DeleteArmy')
    deleteSavedArmy(army.id)
    closeModal()
  }

  // TODO Make the table stuff collapsable
  return (
    <div className="col-12 col-lg-6 col-xl-6 col-xxl-4 mb-2">
      <div className="card">
        <div className="card-body">
          <CardTitle armyName={army.armyName} factionName={army.factionName} createdAt={army.createdAt} />
          <div className="mt-1">
            <SavedArmyTable army={army} />
          </div>
          <div className="d-flex justify-content-center">
            <LoadArmyBtn army={army} />
            <button className="btn btn-sm btn-danger mx-3" onClick={openModal}>
              Delete
            </button>
            <DeleteArmyModal
              modalIsOpen={modalIsOpen}
              closeModal={closeModal}
              handleDelete={handleDeleteClick}
              armyName={army.armyName}
            />
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
