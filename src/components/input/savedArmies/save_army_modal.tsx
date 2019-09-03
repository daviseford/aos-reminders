import React, { useState } from 'react'
import Modal from 'react-modal'
import { FaSave } from 'react-icons/fa'
import { useSubscription } from 'context/useSubscription'
import { ISavedArmy } from 'types/savedArmy'

const btnClass = `btn btn-outline-dark`

interface IModalComponentProps {
  modalIsOpen: boolean
  closeModal: () => void
  army: ISavedArmy
}

export const SaveArmyModal: React.FC<IModalComponentProps> = props => {
  const { closeModal, modalIsOpen, army } = props
  const { isSubscribed, saveArmy } = useSubscription()
  const [armyName, setArmyName] = useState('')

  const handleUpdateName = (e: any) => {
    e.preventDefault()
    setArmyName(e.target.value)
  }

  const handleSaveClick = e => {
    e.preventDefault()
    if (isSubscribed) {
      saveArmy({ ...army, armyName })
      closeModal()
    }
  }

  return (
    <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Save Army Modal">
      <form>
        <div className="form-group">
          <label htmlFor="nameInput">Army Name</label>
          <input
            className="form-control"
            aria-describedby="nameHelp"
            placeholder="Enter army name"
            value={armyName}
            onChange={handleUpdateName}
          />
          <small id="nameHelp" className="form-text text-muted">
            Hint: Use a descriptive name.
          </small>
        </div>
      </form>

      <button className={btnClass} onClick={handleSaveClick}>
        <div className="d-flex align-items-center">
          <FaSave className="mr-2" /> Save Army
        </div>
      </button>

      <button className={`btn btn-outline-danger`} onClick={closeModal}>
        <div className="d-flex align-items-center">Cancel</div>
      </button>
    </Modal>
  )
}
