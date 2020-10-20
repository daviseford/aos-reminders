import GenericButton from 'components/input/generic_button'
import GenericModal from 'components/page/genericModal'
import { useSavedArmies } from 'context/useSavedArmies'
import { useTheme } from 'context/useTheme'
import { TSupportedFaction } from 'meta/factions'
import React, { useState } from 'react'
import { FaCheck } from 'react-icons/fa'
import { logEvent } from 'utils/analytics'

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
  const { theme } = useTheme()
  const [processing, setProcessing] = useState(false)

  const handleDelete = async (e: React.MouseEvent) => {
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
      <div className="flex-row">
        <div className={`col ${theme.text}`}>
          <h4 className="mb-3">Delete {armyName}?</h4>
          <p>This action cannot be undone.</p>
        </div>
      </div>

      <div className="flex-row">
        <div className="col px-0">
          <GenericButton className={theme.modalDangerClass} onClick={handleDelete}>
            <FaCheck className="mr-2" /> Delete
          </GenericButton>

          <GenericButton className={theme.modalConfirmClass} onClick={closeModal}>
            Never mind
          </GenericButton>
        </div>
      </div>
    </GenericModal>
  )
}
