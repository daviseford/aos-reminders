import React from 'react'
import { useSavedArmies } from 'context/useSavedArmies'
import { selectors } from 'ducks'
import { IStore } from 'types/store'
import { connect } from 'react-redux'

interface ILoadedArmyHeaderComponent {}

const LoadedArmyHeaderComponent = () => {
  const { loadedArmy } = useSavedArmies()

  return <div></div>
}

const mapStateToProps = (state: IStore, ownProps) => ({
  ...ownProps,
  ...selectors.getCurrentArmy(state),
})

const LoadedArmyHeader = connect(
  mapStateToProps,
  null
)(LoadedArmyHeaderComponent)

export default LoadedArmyHeader
