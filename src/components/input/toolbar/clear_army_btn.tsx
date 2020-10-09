import GenericButton from 'components/input/generic_button'
import { useSavedArmies } from 'context/useSavedArmies'
import { realmscapeActions, selectionActions } from 'ducks'
import React from 'react'
import { FaTrashAlt } from 'react-icons/fa'
import { useDispatch } from 'react-redux'
import { logClick } from 'utils/analytics'
import { stopEvents } from 'utils/hooks/eventHandlers'

const { resetAllySelections, resetSelections } = selectionActions
const { resetRealmscapeStore } = realmscapeActions

const ClearArmyButton = () => {
  const dispatch = useDispatch()
  const { setLoadedArmy } = useSavedArmies()

  const clearArmyClick = e => {
    stopEvents(e)
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
