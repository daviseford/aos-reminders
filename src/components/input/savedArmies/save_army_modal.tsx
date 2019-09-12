import React, { useState } from 'react'
import Modal from 'react-modal'
import { FaSave } from 'react-icons/fa'
import { useSubscription } from 'context/useSubscription'
import { ISavedArmy } from 'types/savedArmy'
import { SavedArmyTable } from './saved_army_table'
import { prepareArmy } from 'utils/armyUtils'
import { ModalStyle } from '../../../theme/modalStyle'
import { logEvent } from 'utils/analytics'

const btnClass = `btn btn-outline-dark`

interface IModalComponentProps {
  modalIsOpen: boolean
  closeModal: () => void
  showSavedArmies: () => void
  army: ISavedArmy
}

Modal.setAppElement('#root')

export const SaveArmyModal: React.FC<IModalComponentProps> = props => {
  const { closeModal, modalIsOpen, army, showSavedArmies } = props
  const { isSubscribed, saveArmy } = useSubscription()
  const [armyName, setArmyName] = useState('')

  const handleUpdateName = (e: any) => {
    e.preventDefault()
    setArmyName(e.target.value)
  }

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault()
      e.stopPropagation()
      handleSaveClick(e)
    }
  }

  const handleSaveClick = e => {
    e.preventDefault()
    if (isSubscribed) {
      const payload = prepareArmy({ ...army, armyName })
      saveArmy(payload)
      closeModal()
      setArmyName('')
      showSavedArmies()
      logEvent(`SaveArmy`)
    }
  }

  return (
    <Modal style={ModalStyle} isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Save Army Modal">
      <div className={`container`}>
        <div className="row">
          <div className="col">
            <form>
              <div className="form-group">
                <label htmlFor="nameInput">
                  <strong>Army Name</strong>
                </label>
                <input
                  className="form-control"
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

        <div className="row">
          <div className="col">
            <button className={btnClass} onClick={handleSaveClick}>
              <div className="d-flex align-items-center">
                <FaSave className="mr-2" /> Save Army
              </div>
            </button>

            <button className={`btn btn-outline-danger`} onClick={closeModal}>
              <div className="d-flex align-items-center">Cancel</div>
            </button>
          </div>
        </div>

        <div className="row mt-3">
          <div className="col">
            <SavedArmyTable army={army} />
          </div>
        </div>
      </div>
    </Modal>
  )
}
