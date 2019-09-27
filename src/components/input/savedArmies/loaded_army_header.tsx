import React, { useMemo } from 'react'
import { connect } from 'react-redux'
import { useSavedArmies } from 'context/useSavedArmies'
import { selectors } from 'ducks'
import { IStore } from 'types/store'
import { ICurrentArmy } from 'types/army'
import UpdateArmyBtn from './update_army_btn'

const LoadedArmyHeaderComponent: React.FC<ICurrentArmy> = props => {
  const { ...currentArmy } = props
  const { loadedArmy, armyHasChanges } = useSavedArmies()

  const { hasChanges, changedKeys } = useMemo(() => armyHasChanges(currentArmy), [
    currentArmy,
    armyHasChanges,
  ])

  if (!loadedArmy) return null

  return (
    <div className="row d-flex justify-content-center align-content-center mt-2">
      <div className="col-12 text-center">
        <h4 className="text-secondary">{loadedArmy.armyName}</h4>
      </div>
      <div className="col-6">
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
})

const LoadedArmyHeader = connect(
  mapStateToProps,
  {}
)(LoadedArmyHeaderComponent)

export default LoadedArmyHeader
