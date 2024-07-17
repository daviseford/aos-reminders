import GenericButton from 'components/input/generic_button'
import React from 'react'
import { FaPlus } from 'react-icons/fa'

interface IAddAllyButton {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setAllyClick: (e: any) => void
}

const AddAllyButton = ({ setAllyClick }: IAddAllyButton) => {
  return (
    <GenericButton onClick={setAllyClick}>
      <FaPlus className="mr-2" /> Add Ally
    </GenericButton>
  )
}

export default AddAllyButton
