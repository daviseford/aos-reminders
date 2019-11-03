import React, { useState } from 'react'
import { FaSave } from 'react-icons/fa'
import { useSavedArmies } from 'context/useSavedArmies'
import { logEvent } from 'utils/analytics'
import { modalDenyClass, modalConfirmClass } from 'theme/helperClasses'
import GenericModal from 'components/page/genericModal'

interface IModalComponentProps {
  modalIsOpen: boolean
  closeModal: () => void
  currentArmyName: string
  id: string
}

const UpdateArmyNameModal: React.FC<IModalComponentProps> = props => {
  const { closeModal, modalIsOpen, currentArmyName, id } = props
  const { updateArmyName } = useSavedArmies()
  const [armyName, setArmyName] = useState(currentArmyName)
  const [processing, setProcessing] = useState(false)

  const handleUpdateName = (e: any) => {
    e.preventDefault()
    setArmyName(e.target.value)
  }

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      e.stopPropagation()
      e.preventDefault()
      handleUpdateClick(e)
    }
  }

  const handleUpdateClick = async e => {
    e.preventDefault()
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
                <strong>Rename Army</strong>
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
              <small id="nameHelp" className="form-text text-muted">
                Hint: Use a descriptive name.
              </small>
            </div>
          </form>
        </div>
      </div>

      <div className="row">
        <div className="col px-0">
          <button className={modalConfirmClass} onClick={handleUpdateClick}>
            <div className="d-flex align-items-center">
              <FaSave className="mr-2" /> Update
            </div>
          </button>

          <button className={modalDenyClass} onClick={closeModal}>
            <div className="d-flex align-items-center">Cancel</div>
          </button>
        </div>
      </div>
    </GenericModal>
  )
}

export default UpdateArmyNameModal
