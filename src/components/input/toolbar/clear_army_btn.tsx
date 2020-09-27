import GenericButton from 'components/input/generic_button'
import React from 'react'
import { FaTrashAlt } from 'react-icons/fa'

type TClearArmyButton = React.FC<{
  clearArmyClick: (e: any) => void
}>

const ClearArmyButton: TClearArmyButton = ({ clearArmyClick }) => {
  return (
    <GenericButton onClick={clearArmyClick}>
      <FaTrashAlt className="mr-2" /> Clear Army
    </GenericButton>
  )
}

export default ClearArmyButton
