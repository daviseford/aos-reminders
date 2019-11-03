import React, { useState } from 'react'
import { FaCheck } from 'react-icons/fa'
import { IconContext } from 'react-icons'
import { logEvent } from 'utils/analytics'
import { useSavedArmies } from 'context/useSavedArmies'
import { TSupportedFaction } from 'meta/factions'
import GenericButton from '../generic_button'
import GenericModal from 'components/page/genericModal'

interface IModalComponentProps {
  armyName: string
  closeModal: () => void
  factionName: TSupportedFaction
  id: string
  modalIsOpen: boolean
}

export const DeleteArmyModal: React.FC<IModalComponentProps> = props => {
  const { closeModal, modalIsOpen, armyName, factionName, id } = props
  const { deleteSavedArmy } = useSavedArmies()
  const [processing, setProcessing] = useState(false)

  const handleDelete = async e => {
    e.preventDefault()
    setProcessing(true)
    await deleteSavedArmy(id)
    setProcessing(false)
    closeModal()
    logEvent(`DeleteArmy-${factionName}`)
  }

  return (
    <GenericModal
      isOpen={modalIsOpen}
      closeModal={closeModal}
      label="Delete Army Modal"
      isProcessing={processing}
    >
      <div className="row">
        <IconContext.Provider value={{ size: '1.7em' }}>
          <div className="col">
            <h4 className="mb-3">Delete {armyName}?</h4>
            <p>This action cannot be undone.</p>
          </div>
        </IconContext.Provider>
      </div>

      <div className="row">
        <div className="col">
          <GenericButton className={`btn btn-outline-danger mx-2`} onClick={handleDelete}>
            <FaCheck className="mr-2" /> Delete
          </GenericButton>

          <GenericButton className={`btn btn-outline-dark mx-2`} onClick={closeModal}>
            Never mind
          </GenericButton>
        </div>
      </div>
    </GenericModal>
  )
}
