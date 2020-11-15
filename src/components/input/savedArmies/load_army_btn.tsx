import GenericButton from 'components/input/generic_button'
import { useAppStatus } from 'context/useAppStatus'
import { useSavedArmies } from 'context/useSavedArmies'
import React from 'react'
import { ISavedArmyFromApi } from 'types/savedArmy'
import { logEvent, resetAnalyticsStore } from 'utils/analytics'
import { addArmyToStore } from 'utils/loadArmy/loadArmyHelpers'

interface ILoadButtonProps {
  army: ISavedArmyFromApi
}

export const LoadArmyBtn: React.FC<ILoadButtonProps> = ({ army }) => {
  const { isOnline } = useAppStatus()
  const { setLoadedArmy } = useSavedArmies()

  const handleLoadClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (isOnline) logEvent(`LoadArmy-${army.factionName}`)
    resetAnalyticsStore()
    setLoadedArmy({ id: army.id, armyName: army.armyName })
    addArmyToStore(army)
  }

  return (
    <GenericButton className="btn btn-sm btn-primary mx-3" onClick={handleLoadClick}>
      Load Army
    </GenericButton>
  )
}
