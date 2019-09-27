import React, { useMemo } from 'react'
import { connect } from 'react-redux'
import { useSavedArmies } from 'context/useSavedArmies'
import { selectors } from 'ducks'
import { IStore } from 'types/store'
import { ICurrentArmy } from 'types/army'

const LoadedArmyHeaderComponent: React.FC<ICurrentArmy> = props => {
  const { ...currentArmy } = props
  const { loadedArmy, armyHasChanges } = useSavedArmies()

  const hasChanges = useMemo(() => armyHasChanges(currentArmy), [currentArmy, armyHasChanges])

  if (!loadedArmy) return null

  return <div>HasChanges: {hasChanges.toString()}</div>
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
