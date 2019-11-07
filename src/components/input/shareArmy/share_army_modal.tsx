import React, { useState, useEffect } from 'react'
import { FaLink } from 'react-icons/fa'
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
  const { closeModal, modalIsOpen, army, hiddenReminders } = props
  const { saveLink } = useSavedArmies()
  const { theme } = useTheme()
  const [link, setLink] = useState<string | null>(null)

  const handleLinkGeneration = async () => {
    const payload = prepareArmy({ ...army, hiddenReminders }, 'save')
    const url = await saveLink(payload as ISavedArmy)
    setLink(url)
    logEvent(`GeneratedLink-${army.factionName}`)
  }

  useEffect(() => {
    handleLinkGeneration()
    return () => setLink(null)
  }, [])

  return (
    <GenericModal isOpen={modalIsOpen} closeModal={closeModal} label="Share Link Modal">
      <div className="row">
        <div className="col">
          <form>
            <div className="form-group">
              <label htmlFor="nameInput">
                <strong className={theme.text}>Share Link</strong>
              </label>

              {link}
            </div>
          </form>
        </div>
      </div>

      <div className="row">
        <div className="col pl-0">
          <GenericButton className={theme.modalConfirmClass} onClick={() => console.log('todo')}>
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
