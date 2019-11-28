import React from 'react'
import { useSavedArmies } from 'context/useSavedArmies'
import { useAppStatus } from 'context/useAppStatus'
import { logEvent } from 'utils/analytics'
import { addArmyToStore } from 'utils/loadArmyHelpers'
import { ISavedArmyFromApi } from 'types/savedArmy'

interface ILoadButtonProps {
  army: ISavedArmyFromApi
}

export const LoadArmyBtn: React.FC<ILoadButtonProps> = ({ army }) => {
  const { isOnline } = useAppStatus()
  const { setLoadedArmy } = useSavedArmies()

  const handleLoadClick = async e => {
    e.preventDefault()
    if (isOnline) logEvent(`LoadArmy-${army.factionName}`)
    setLoadedArmy({ id: army.id, armyName: army.armyName })
    addArmyToStore(army)
  }

  return (
    <button className="btn btn-sm btn-primary mx-3" onClick={handleLoadClick}>
      Load Army
    </button>
  )
}
