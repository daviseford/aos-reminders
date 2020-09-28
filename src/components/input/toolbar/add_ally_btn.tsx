import GenericButton from 'components/input/generic_button'
import React from 'react'
import { FaPlus } from 'react-icons/fa'

interface IAddAllyButton {
  setAllyClick: (e: React.MouseEvent) => void
}

const AddAllyButton: React.FC<IAddAllyButton> = ({ setAllyClick }) => {
  return (
    <GenericButton onClick={setAllyClick}>
      <FaPlus className="mr-2" /> Add Ally
    </GenericButton>
  )
}

export default AddAllyButton
