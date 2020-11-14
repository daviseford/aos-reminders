import GenericButton from 'components/input/generic_button'
import { SavedArmyTable } from 'components/input/savedArmies/saved_army_table'
import GenericModal from 'components/page/genericModal'
import { useSavedArmies } from 'context/useSavedArmies'
import { useSubscription } from 'context/useSubscription'
import { useTheme } from 'context/useTheme'
import { selectors } from 'ducks'
import React, { useState } from 'react'
import { FaSave } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { ISavedArmy } from 'types/savedArmy'
import { logEvent } from 'utils/analytics'
import { prepareArmy } from 'utils/armyUtils'
import useGetReminders from 'utils/hooks/useGetReminders'

interface IModalComponentProps {
  modalIsOpen: boolean
  closeModal: () => void
  showSavedArmies: () => void
}

export const SaveArmyModal: React.FC<IModalComponentProps> = props => {
  const { closeModal, modalIsOpen, showSavedArmies } = props
  const army = useSelector(selectors.selectCurrentArmy)
  const { relevantNotes } = useGetReminders()
  const hiddenReminders = useSelector(selectors.selectReminders)
  const { isActive } = useSubscription()
  const { saveArmy } = useSavedArmies()
  const { theme } = useTheme()
  const [armyName, setArmyName] = useState('')
  const [processing, setProcessing] = useState(false)

  const handleUpdateName = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setArmyName(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.stopPropagation()
      e.preventDefault()
      handleSaveClick()
    }
  }

  const handleSaveClick = async (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e?.preventDefault?.()
    if (isActive) {
      setProcessing(true)
      const payload = prepareArmy({ ...army, hiddenReminders, armyName, notes: relevantNotes }, 'save')
      await saveArmy(payload as ISavedArmy)
      setProcessing(false)
      setArmyName('')
      closeModal()
      showSavedArmies()
      logEvent(`SaveArmy-${army.factionName}`)
    }
  }

  return (
    <GenericModal
      isProcessing={processing}
      isOpen={modalIsOpen}
      closeModal={closeModal}
      label="Save Army Modal"
    >
      <div className="row">
        <div className="col">
          <form>
            <div className="form-group">
              <label htmlFor="nameInput">
                <strong className={theme.text}>Army Name</strong>
              </label>
              <input
                className="form-control form-control-sm"
                aria-describedby="nameHelp"
                placeholder="Enter army name"
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
        <div className="col pl-0">
          <GenericButton className={theme.modalConfirmClass} onClick={handleSaveClick}>
            <FaSave className="mr-2" /> Save
          </GenericButton>

          <GenericButton className={theme.modalDangerClass} onClick={closeModal}>
            Cancel
          </GenericButton>
        </div>
      </div>

      <div className="row mt-3">
        <div className="col">
          <SavedArmyTable army={army} />
        </div>
      </div>
    </GenericModal>
  )
}
