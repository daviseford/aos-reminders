import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { useAuth0 } from 'react-auth0-wrapper'
import { loadSavedArmiesFromApi } from 'api/thunks'
import { subscription, savedArmies } from 'ducks'
import { SavedArmyCard } from './saved_army_card'
import { IStore, TSavedArmiesStore } from 'types/store'
import { ISavedArmyFromApi } from 'types/savedArmy'

interface IShowSavedArmiesProps {
  savedArmies: TSavedArmiesStore
  loadSavedArmies: (savedArmies: ISavedArmyFromApi[]) => void
  isSubscribed: boolean
}

const ShowSavedArmiesComponent: React.FC<IShowSavedArmiesProps> = props => {
  const { savedArmies, loadSavedArmies, isSubscribed } = props
  const { isAuthenticated, user } = useAuth0()

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
  isSubscribed: subscription.selectors.isSubscribed(state),
  savedArmies: savedArmies.selectors.getSavedArmies(state),
})

export const ShowSavedArmies = connect(
  mapStateToProps,
  {
    loadSavedArmies: savedArmies.actions.loadSavedArmies,
  }
)(ShowSavedArmiesComponent)
