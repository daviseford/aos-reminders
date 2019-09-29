import React, { useState } from 'react'
import { DateTime } from 'luxon'
import { titleCase } from 'utils/textUtils'
import { LoadArmyBtn } from './load_army_btn'
import { SavedArmyTable } from './saved_army_table'
import { DeleteArmyModal } from './delete_army_modal'
import { ISavedArmyFromApi } from 'types/savedArmy'
import UpdateNameButton from './update_name_btn'

interface ISavedArmyCardProps {
  army: ISavedArmyFromApi
}

export const SavedArmyCard: React.FC<ISavedArmyCardProps> = props => {
  const { army } = props

  const [modalIsOpen, setModalIsOpen] = useState(false)

  const openModal = () => setModalIsOpen(true)
  const closeModal = () => setModalIsOpen(false)

  // TODO Make the table stuff collapsable
  return (
    <div className="col-12 col-lg-6 col-xl-6 col-xxl-4 mb-2">
      <div className="card">
        <div className="card-body">
          <CardTitle
            id={army.id}
            armyName={army.armyName}
            factionName={army.factionName}
            createdAt={army.createdAt}
          />
          <div className="mt-1">
            <SavedArmyTable army={army} />
          </div>
          <div className="d-flex justify-content-center">
            <LoadArmyBtn army={army} />
            <button className="btn btn-sm btn-danger mx-3" onClick={openModal}>
              Delete
            </button>
            {modalIsOpen && (
              <DeleteArmyModal
                modalIsOpen={modalIsOpen}
                closeModal={closeModal}
                armyName={army.armyName}
                id={army.id}
              />
            )}
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
  id: ISavedArmyFromApi['id']
}

const CardTitle = ({ armyName, factionName, createdAt, id }: ICardTitleProps) => {
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
      <div className="d-flex mb-1 justify-content-start align-items-center">
        <div>
          <UpdateNameButton size="0.75rem" className="mr-3" armyName={armyName} id={id} />
        </div>
        <div className="flex-grow-1">
          <h5 className="card-title mb-0">{armyName ? armyName : `Untitled`}</h5>
        </div>
      </div>

      <div className="d-flex justify-content-around">
        <small className="flex-fill text-muted">{faction}</small>
        <small className="flex-fill text-muted text-right mr-2">Created: {created}</small>
      </div>
    </>
  )
}
