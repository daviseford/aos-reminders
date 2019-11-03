import React, { useState } from 'react'
import { FaSave } from 'react-icons/fa'
import { useSubscription } from 'context/useSubscription'
import { useSavedArmies } from 'context/useSavedArmies'
import { logEvent } from 'utils/analytics'
import { prepareArmy } from 'utils/armyUtils'
import { SavedArmyTable } from './saved_army_table'
import { modalConfirmClass, modalDenyClass } from 'theme/helperClasses'
import { ISavedArmy } from 'types/savedArmy'
import { IVisibilityStore } from 'types/store'
import GenericModal from 'components/page/genericModal'

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
                <strong>Army Name</strong>
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
              <small id="nameHelp" className="form-text text-muted">
                Hint: Use a descriptive name.
              </small>
            </div>
          </form>
        </div>
      </div>

      <div className="row">
        <div className="col pl-0">
          <button className={modalConfirmClass} onClick={handleSaveClick}>
            <div className="d-flex align-items-center">
              <FaSave className="mr-2" /> Save
            </div>
          </button>

          <button className={modalDenyClass} onClick={closeModal}>
            <div className="d-flex align-items-center">Cancel</div>
          </button>
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
