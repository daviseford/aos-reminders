import React, { useState } from 'react'
import Modal from 'react-modal'
import { FaSave } from 'react-icons/fa'
import { useSubscription } from 'context/useSubscription'
import { useSavedArmies } from 'context/useSavedArmies'
import { logEvent } from 'utils/analytics'
import { prepareArmy } from 'utils/armyUtils'
import { SavedArmyTable } from './saved_army_table'
import { ModalStyle } from 'theme/modalStyle'
import { modalConfirmClass, modalDenyClass } from 'theme/helperClasses'
import { ISavedArmy } from 'types/savedArmy'
import Spinner from 'components/helpers/spinner'

interface IModalComponentProps {
  modalIsOpen: boolean
  closeModal: () => void
  showSavedArmies: () => void
  army: ISavedArmy
}

Modal.setAppElement('#root')

export const SaveArmyModal: React.FC<IModalComponentProps> = props => {
  const { closeModal, modalIsOpen, army, showSavedArmies } = props
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
      const payload = prepareArmy({ ...army, armyName }, 'save')
      await saveArmy(payload as ISavedArmy)
      setProcessing(false)
      closeModal()
      setArmyName('')
      showSavedArmies()
      logEvent(`SaveArmy`)
    }
  }

  return (
    <Modal style={ModalStyle} isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Save Army Modal">
      <div className={`container mr-3 pl-0`}>
        {processing && <Spinner />}
        <div className="row" hidden={processing}>
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
                />
                <small id="nameHelp" className="form-text text-muted">
                  Hint: Use a descriptive name.
                </small>
              </div>
            </form>
          </div>
        </div>

        <div className="row" hidden={processing}>
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

        <div className="row mt-3" hidden={processing}>
          <div className="col">
            <SavedArmyTable army={army} />
          </div>
        </div>
      </div>
    </Modal>
  )
}
