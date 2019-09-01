import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { useAuth0 } from 'react-auth0-wrapper'
import { FaSave } from 'react-icons/fa'
import { useSubscription } from 'context/useSubscription'
import { saveArmyToApi } from 'api/thunks'
import { factionNames, selections, realmscape, savedArmies } from 'ducks'
import { ISavedArmy, ISavedArmyFromApi } from 'types/savedArmy'
import { IStore } from 'types/store'

interface ISaveArmyBtnProps extends ISavedArmy {
  createSavedArmy: (army: ISavedArmyFromApi) => void
}

const SaveArmyBtnComponent: React.FC<ISaveArmyBtnProps> = props => {
  const { createSavedArmy, ...savedArmy } = props
  const { isAuthenticated, loginWithRedirect, user } = useAuth0()
  const { isSubscribed } = useSubscription()

  const btnText =
    isAuthenticated && isSubscribed
      ? `Save Army`
      : `${isAuthenticated ? `Become a supporter` : `Log in`} to save this army`

  const handleSaveClick = e => {
    e.preventDefault()
    if (isAuthenticated && isSubscribed) {
      saveArmyToApi(user, savedArmy, createSavedArmy)
    } else {
      loginWithRedirect()
    }
  }

  // TODO: Add a tooltip or something explaining to sign up to save armies

  const btnClass = `btn btn-outline-dark`

  return (
    <div className="row text-center py-3">
      <div className="col">
        {isAuthenticated && !isSubscribed ? (
          <Link to="/subscribe" className={btnClass}>
            <div className="d-flex align-items-center">
              <FaSave className="mr-2" /> {btnText}
            </div>
          </Link>
        ) : (
          <button className={btnClass} onClick={handleSaveClick}>
            <div className="d-flex align-items-center">
              <FaSave className="mr-2" /> {btnText}
            </div>
          </button>
        )}
      </div>
    </div>
  )
}

const mapStateToProps = (state: IStore, ownProps) => ({
  ...ownProps,
  allyFactionNames: selections.selectors.getAllyFactionNames(state),
  allySelections: selections.selectors.getAllySelections(state),
  factionName: factionNames.selectors.getFactionName(state),
  realmscape_feature: realmscape.selectors.getRealmscapeFeature(state),
  realmscape: realmscape.selectors.getRealmscape(state),
  selections: selections.selectors.getSelections(state),
})

export const SaveArmyBtn = connect(
  mapStateToProps,
  {
    createSavedArmy: savedArmies.actions.createSavedArmy,
  }
)(SaveArmyBtnComponent)
