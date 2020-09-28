import GenericButton from 'components/input/generic_button'
import GenericModal from 'components/page/genericModal'
import { useSavedArmies } from 'context/useSavedArmies'
import { useTheme } from 'context/useTheme'
import React, { useCallback, useState } from 'react'
import { FaSave } from 'react-icons/fa'
import { logEvent } from 'utils/analytics'
import { stopEvents } from 'utils/hooks/eventHandlers'

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

  const handleUpdateName = stopEvents(e => setArmyName(e?.target?.value || ''), 'input')
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log('asdasdasd', e, e.key)
    if (e.key === 'Enter') {
      e.stopPropagation()
      e.preventDefault()
      handleUpdateClick()
    }
  }

  const handleUpdateClick = useCallback(
    stopEvents(async () => {
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
    }, 'mouse'),
    [armyName, closeModal, currentArmyName, id, updateArmyName]
  )

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
