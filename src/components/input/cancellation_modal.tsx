import React from 'react'
import Modal from 'react-modal'
import { FaCheck, FaRegSadCry } from 'react-icons/fa'
import { useSubscription } from 'context/useSubscription'
import { IconContext } from 'react-icons'

interface IModalComponentProps {
  modalIsOpen: boolean
  closeModal: () => void
}

Modal.setAppElement('#root')

export const CancelSubscriptionModal: React.FC<IModalComponentProps> = props => {
  const { closeModal, modalIsOpen } = props
  const { cancelSubscription } = useSubscription()

  const handleClick = e => {
    e.preventDefault()
    cancelSubscription()
  }

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  }

  return (
    <Modal
      style={customStyles}
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      contentLabel="Cancel Subscription Modal"
    >
      <div className={`container`}>
        <div className="row">
          <IconContext.Provider value={{ size: '1.7em' }}>
            <div className="col">
              <h4 className="mb-3">Cancel Subscription?</h4>
              <p>
                I'll be sad to see you go <FaRegSadCry />
              </p>
              <p>
                You'll still have access to all of your saved armies until your current subscription expires.
              </p>
            </div>
          </IconContext.Provider>
        </div>

        <div className="row">
          <div className="col">
            <button className={`btn btn-outline-danger mx-2`} onClick={handleClick}>
              <div className="d-flex align-items-center">
                <FaCheck className="mr-2" /> Cancel Subscription
              </div>
            </button>

            <button className={`btn btn-outline-dark mx-2`} onClick={closeModal}>
              <div className="d-flex align-items-center">Never mind</div>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
