import React, { useMemo } from 'react'
import { connect } from 'react-redux'
import { useSavedArmies } from 'context/useSavedArmies'
import { selectors } from 'ducks'
import UpdateArmyBtn from './update_army_btn'
import UpdateNameButton from './update_name_btn'
import { ICurrentArmy } from 'types/army'
import { IStore } from 'types/store'
import { useAppStatus } from 'context/useAppStatus'
import { useTheme } from 'context/useTheme'

const LoadedArmyHeaderComponent: React.FC<ICurrentArmy> = props => {
  const { ...currentArmy } = props
  const { isOffline } = useAppStatus()
  const { loadedArmy, armyHasChanges } = useSavedArmies()
  const { theme } = useTheme()

  const { hasChanges, changedKeys } = useMemo(() => armyHasChanges(currentArmy), [
    currentArmy,
    armyHasChanges,
  ])

  if (!loadedArmy) return null

  return (
    <div className={`row ${theme.bgColor} d-flex text-center justify-content-center mt-3 mb-1`}>
      <div className="flex-row d-flex">
        <div className="flex-grow-1 ml-3">
          <h4 className={theme.textSecondary}>{loadedArmy.armyName}</h4>
        </div>
        <div className="ml-2 mr-3" hidden={isOffline}>
          <UpdateNameButton size="0.85rem" className={theme.textSecondary} {...loadedArmy} />
        </div>
      </div>
      <div className="col-12" hidden={isOffline}>
        {hasChanges && (
          <UpdateArmyBtn
            currentArmy={{ ...currentArmy, ...loadedArmy }}
            changedKeys={changedKeys}
            id={loadedArmy.id}
          />
        )}
      </div>
    </div>
  )
}

const mapStateToProps = (state: IStore, ownProps) => ({
  ...ownProps,
  ...selectors.getCurrentArmy(state),
  hiddenReminders: selectors.getReminders(state),
})

const LoadedArmyHeader = connect(
  mapStateToProps,
  {}
)(LoadedArmyHeaderComponent)

export default LoadedArmyHeader
