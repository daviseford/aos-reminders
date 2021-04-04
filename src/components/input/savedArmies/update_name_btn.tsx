import UpdateArmyNameModal from 'components/modals/update_name_modal'
import React, { useState } from 'react'
import { IconContext } from 'react-icons'
import { FaPencilAlt } from 'react-icons/fa'

type TUpdateName = React.FC<{ id: string; armyName: string; className?: string; size?: string }>

const UpdateNameButton: TUpdateName = ({ id, armyName, className = '', size = '1rem' }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false)

  const closeModal = () => setModalIsOpen(false)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setModalIsOpen(true)
  }

  return (
    <>
      <IconContext.Provider value={{ size }}>
        <FaPencilAlt className={`${className} d-print-none`} onClick={handleClick} />
        {modalIsOpen && (
          <UpdateArmyNameModal
            modalIsOpen={modalIsOpen}
            closeModal={closeModal}
            id={id}
            currentArmyName={armyName}
          />
        )}
      </IconContext.Provider>
    </>
  )
}

export default UpdateNameButton
