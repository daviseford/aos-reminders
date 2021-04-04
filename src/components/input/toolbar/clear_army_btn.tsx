import GenericButton from 'components/input/generic_button'
import { useSavedArmies } from 'context/useSavedArmies'
import { realmscapeActions, selectionActions } from 'ducks'
import React from 'react'
import { FaTrashAlt } from 'react-icons/fa'
import { useDispatch } from 'react-redux'
import { logClick } from 'utils/analytics'

const { resetAllySelections, resetSelections } = selectionActions
const { resetRealmscapeStore } = realmscapeActions

const ClearArmyButton = () => {
  const dispatch = useDispatch()
  const { setLoadedArmy } = useSavedArmies()

  const clearArmyClick = (e: React.MouseEvent) => {
    e.preventDefault()
    dispatch(resetAllySelections())
    dispatch(resetRealmscapeStore())
    dispatch(resetSelections())
    logClick('ClearArmy')
    setLoadedArmy(null)
  }

  return (
    <GenericButton onClick={clearArmyClick}>
      <FaTrashAlt className="mr-2" /> Clear Army
    </GenericButton>
  )
}

export default ClearArmyButton
