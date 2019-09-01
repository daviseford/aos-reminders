import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { useAuth0 } from 'react-auth0-wrapper'
import { useSubscription } from 'context/useSubscription'
import { loadSavedArmiesFromApi } from 'api/thunks'
import { savedArmies } from 'ducks'
import { SavedArmyCard } from './saved_army_card'
import { ISavedArmyFromApi } from 'types/savedArmy'
import { IStore, TSavedArmiesStore } from 'types/store'

interface IShowSavedArmiesProps {
  savedArmies: TSavedArmiesStore
  loadSavedArmies: (savedArmies: ISavedArmyFromApi[]) => void
}

const ShowSavedArmiesComponent: React.FC<IShowSavedArmiesProps> = props => {
  const { savedArmies, loadSavedArmies } = props
  const { isAuthenticated, user } = useAuth0()
  const { isSubscribed } = useSubscription()

  useEffect(() => {
    if (isAuthenticated && isSubscribed) {
      loadSavedArmiesFromApi(user, loadSavedArmies)
    }
  }, [isAuthenticated, user, loadSavedArmies, isSubscribed])

  return (
    <div>
      {savedArmies.map((army, i) => (
        <SavedArmyCard key={i} army={army} />
      ))}
    </div>
  )
}

const mapStateToProps = (state: IStore, ownProps) => ({
  ...ownProps,
  savedArmies: savedArmies.selectors.getSavedArmies(state),
})

export const ShowSavedArmies = connect(
  mapStateToProps,
  {
    loadSavedArmies: savedArmies.actions.loadSavedArmies,
  }
)(ShowSavedArmiesComponent)
