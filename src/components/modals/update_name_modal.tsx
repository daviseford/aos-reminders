import GenericTwoButtonModal from 'components/modals/generic/generic_two_button_modal'
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

  const handleUpdateClick = async () => {
    // Don't hit the API if they don't make a change :)
    if (armyName === currentArmyName) return

    await updateArmyName(id, armyName || 'Untitled')
    setArmyName(armyName || 'Untitled')
    logEvent(`UpdateArmyName`)
  }

  return (
    <GenericTwoButtonModal
      closeModal={closeModal}
      confirmBtnClass={theme.modalConfirmClass}
      confirmIcon={FaSave}
      confirmText={'Update'}
      denyBtnClass={theme.modalDangerClass}
      isOpen={modalIsOpen}
      onConfirmAsync={handleUpdateClick}
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
    </GenericTwoButtonModal>
  )
}

export default UpdateArmyNameModal
