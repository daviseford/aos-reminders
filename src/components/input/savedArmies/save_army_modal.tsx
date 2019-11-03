import React, { useState } from 'react'
import { FaSave } from 'react-icons/fa'
import { useSubscription } from 'context/useSubscription'
import { useSavedArmies } from 'context/useSavedArmies'
import { useTheme } from 'context/useTheme'
import { logEvent } from 'utils/analytics'
import { prepareArmy } from 'utils/armyUtils'
import GenericModal from 'components/page/genericModal'
import GenericButton from '../generic_button'
import { SavedArmyTable } from './saved_army_table'
import { ISavedArmy } from 'types/savedArmy'
import { IVisibilityStore } from 'types/store'

interface IModalComponentProps {
  modalIsOpen: boolean
  closeModal: () => void
  showSavedArmies: () => void
  army: ISavedArmy
  hiddenReminders: IVisibilityStore['reminders']
}

export const SaveArmyModal: React.FC<IModalComponentProps> = props => {
  const { closeModal, modalIsOpen, army, hiddenReminders, showSavedArmies } = props
  const { isSubscribed } = useSubscription()
  const { saveArmy } = useSavedArmies()
  const { theme } = useTheme()
  const [armyName, setArmyName] = useState('')
  const [processing, setProcessing] = useState(false)

  const handleUpdateName = (e: any) => {
    e.preventDefault()
    setArmyName(e.target.value)
  }

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      e.stopPropagation()
      e.preventDefault()
      handleSaveClick(e)
    }
  }

  const handleSaveClick = async e => {
    e.preventDefault()
    if (isSubscribed) {
      setProcessing(true)
      const payload = prepareArmy({ ...army, hiddenReminders, armyName }, 'save')
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

          <GenericButton className={theme.modalDenyClass} onClick={closeModal}>
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
