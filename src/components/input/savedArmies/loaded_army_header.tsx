import React, { useMemo } from 'react'
import { connect } from 'react-redux'
import { useSavedArmies } from 'context/useSavedArmies'
import { selectors } from 'ducks'
import UpdateArmyBtn from './update_army_btn'
import UpdateNameButton from './update_name_btn'
import { ICurrentArmy } from 'types/army'
import { IStore } from 'types/store'

const LoadedArmyHeaderComponent: React.FC<ICurrentArmy> = props => {
  const { ...currentArmy } = props
  const { loadedArmy, armyHasChanges } = useSavedArmies()

  const { hasChanges, changedKeys } = useMemo(() => armyHasChanges(currentArmy), [
    currentArmy,
    armyHasChanges,
  ])

  if (!loadedArmy) return null

  return (
    <div className="row d-flex justify-content-center align-content-center my-2">
      <div className="text-center d-flex align-content-center">
        <div className="flex-grow-1">
          <h4 className="text-secondary">{loadedArmy.armyName}</h4>
        </div>
        <div>
          <UpdateNameButton size="0.85rem" className="ml-3 text-secondary" {...loadedArmy} />
        </div>
      </div>
      <div className="col-12 text-center">
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
