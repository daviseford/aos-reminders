import React, { useState } from 'react'
import { FaLink } from 'react-icons/fa'
import { useSubscription } from 'context/useSubscription'
import { useSavedArmies } from 'context/useSavedArmies'
import { useTheme } from 'context/useTheme'
import { logEvent } from 'utils/analytics'
import { prepareArmy } from 'utils/armyUtils'
import GenericModal from 'components/page/genericModal'
import GenericButton from '../generic_button'
import { ISavedArmy } from 'types/savedArmy'
import { IVisibilityStore } from 'types/store'

interface IModalComponentProps {
  modalIsOpen: boolean
  closeModal: () => void
  showSavedArmies: () => void
  army: ISavedArmy
  hiddenReminders: IVisibilityStore['reminders']
}

export const ShareArmyModal: React.FC<IModalComponentProps> = props => {
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
                <strong className={theme.text}>Share Link</strong>
              </label>

              {/* <input
                className="form-control form-control-sm"
                aria-describedby="nameHelp"
                placeholder="Enter army name"
                value={armyName}
                onKeyDown={handleKeyDown}
                onChange={handleUpdateName}
                tabIndex={0}
                autoFocus
              /> */}
            </div>
          </form>
        </div>
      </div>

      <div className="row">
        <div className="col pl-0">
          <GenericButton className={theme.modalConfirmClass} onClick={handleSaveClick}>
            <FaLink className="mr-2" /> Copy
          </GenericButton>

          <GenericButton className={theme.modalDangerClass} onClick={closeModal}>
            Cancel
          </GenericButton>
        </div>
      </div>
    </GenericModal>
  )
}
