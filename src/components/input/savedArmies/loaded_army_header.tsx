import UpdateNameButton from 'components/input/savedArmies/update_name_btn'
import { useAppStatus } from 'context/useAppStatus'
import { useSavedArmies } from 'context/useSavedArmies'
import { useTheme } from 'context/useTheme'
import React from 'react'

const LoadedArmyHeader = () => {
  const { isOffline } = useAppStatus()
  const { loadedArmy } = useSavedArmies()
  const { theme } = useTheme()

  if (!loadedArmy) return null

  return (
    <div className={`row d-flex text-center justify-content-center mt-3 mb-1`}>
      <div className="flex-row d-flex">
        <div className="flex-grow-1 ml-3">
          <h4 className={theme.textSecondary}>{loadedArmy.armyName}</h4>
        </div>
        <div className="ml-2 mr-3" hidden={isOffline}>
          <UpdateNameButton size="0.85rem" className={theme.textSecondary} {...loadedArmy} />
        </div>
      </div>
    </div>
  )
}

export default LoadedArmyHeader
