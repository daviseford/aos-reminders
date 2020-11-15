import GenericButton from 'components/input/generic_button'
import GenericModal from 'components/modals/generic_modal'
import { useSavedArmies } from 'context/useSavedArmies'
import { useTheme } from 'context/useTheme'
import React, { useState } from 'react'
import { FaSave } from 'react-icons/fa'
import { logEvent } from 'utils/analytics'

interface IModalComponentProps {
  modalIsOpen: boolean
  closeModal: () => void
  currentArmyName: string
  id: string
}

const UpdateArmyNameModal: React.FC<IModalComponentProps> = props => {
  const { closeModal, modalIsOpen, currentArmyName, id } = props
  const { updateArmyName } = useSavedArmies()
  const { theme } = useTheme()
  const [armyName, setArmyName] = useState(currentArmyName)
  const [processing, setProcessing] = useState(false)

  const handleUpdateName = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setArmyName(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.stopPropagation()
      e.preventDefault()
      handleUpdateClick()
    }
  }

  const handleUpdateClick = async (e?: React.MouseEvent) => {
    e?.preventDefault?.()
    if (armyName === currentArmyName) {
      closeModal()
      return // Don't hit the API if they don't make a change :)
    }
    setProcessing(true)
    await updateArmyName(id, armyName || 'Untitled')
    setProcessing(false)
    setArmyName(armyName || 'Untitled')
    closeModal()
    logEvent(`UpdateArmyName`)
  }

  return (
    <GenericModal
      isOpen={modalIsOpen}
      closeModal={closeModal}
      label="Update Army Name Modal"
      isProcessing={processing}
    >
      <div className="row">
        <div className="col">
          <form>
            <div className="form-group">
              <label htmlFor="nameInput">
                <strong className={theme.text}>Rename Army</strong>
              </label>
              <input
                className="form-control form-control-sm"
                aria-describedby="nameHelp"
                value={armyName}
                onKeyDown={handleKeyDown}
                onChange={handleUpdateName}
                tabIndex={0}
                autoFocus
              />
              <small id="nameHelp" className={`form-text ${theme.textMuted}`}>
                Hint: Use a descriptive name.
              </small>
            </div>
          </form>
        </div>
      </div>

      <div className="row">
        <div className="col px-0">
          <GenericButton className={theme.modalConfirmClass} onClick={handleUpdateClick}>
            <FaSave className="mr-2" /> Update
          </GenericButton>

          <GenericButton className={theme.modalDangerClass} onClick={closeModal}>
            Cancel
          </GenericButton>
        </div>
      </div>
    </GenericModal>
  )
}

export default UpdateArmyNameModal
