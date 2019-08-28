import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { useAuth0 } from 'react-auth0-wrapper'
import { FaSave } from 'react-icons/fa'
import { IStore, TSavedArmiesStore } from 'types/store'
import { factionNames, selections, realmscape } from 'ducks'
import { ISavedArmy, ISavedArmyFromApi } from 'types/savedArmy'
import { savedArmies } from 'ducks/savedArmies'
import { saveArmyToApi, loadSavedArmiesFromApi } from 'api/thunks'

interface ISaveArmyProps extends ISavedArmy {
  createSavedArmy: (army: ISavedArmyFromApi) => void
}

const SaveSectionComponent: React.FC<ISaveArmyProps> = props => {
  const { createSavedArmy, ...savedArmy } = props
  const { isAuthenticated, loginWithRedirect, user } = useAuth0()
  const isSubscriber = true // TODO

  const btnText = isAuthenticated ? `Save Army` : `Become a supporter to save this army`

  const handleSaveClick = e => {
    e.preventDefault()
    if (isAuthenticated && isSubscriber) {
      saveArmyToApi(user, savedArmy, createSavedArmy)
      console.log('authenticated, not necessarily a subscriber')
    } else {
      console.log('needs to sign up')
      loginWithRedirect()
    }
  }

  // TODO: Add a tooltip or something explaining to sign up to save armies

  return (
    <div className="row justify-content-center pt-3">
      <div className="col">
        <button className={`btn btn-block btn-outline-dark`} onClick={handleSaveClick}>
          <FaSave /> {btnText}
        </button>
      </div>
    </div>
  )
}

const mapStateToProps1 = (state: IStore, ownProps) => ({
  ...ownProps,
  allyFactionNames: selections.selectors.getAllyFactionNames(state),
  allySelections: selections.selectors.getAllySelections(state),
  factionName: factionNames.selectors.getFactionName(state),
  realmscape_feature: realmscape.selectors.getRealmscapeFeature(state),
  realmscape: realmscape.selectors.getRealmscape(state),
  selections: selections.selectors.getSelections(state),
})

export const SaveSection = connect(
  mapStateToProps1,
  {
    createSavedArmy: savedArmies.actions.createSavedArmy,
  }
)(SaveSectionComponent)

interface IShowSavedArmiesProps {
  savedArmies: TSavedArmiesStore
  loadSavedArmies: (savedArmies: ISavedArmyFromApi[]) => void
}

const ShowSavedArmiesComponent: React.FC<IShowSavedArmiesProps> = props => {
  const { savedArmies, loadSavedArmies } = props
  const { isAuthenticated, user } = useAuth0()

  useEffect(() => {
    if (isAuthenticated) {
      loadSavedArmiesFromApi(user, loadSavedArmies)
    }
  }, [isAuthenticated, user, loadSavedArmies])

  return (
    <div>
      {savedArmies.map((army, i) => {
        return <SavedArmyCard key={i} {...army} />
      })}
    </div>
  )
}

const mapStateToProps2 = (state: IStore, ownProps) => ({
  ...ownProps,
  savedArmies: savedArmies.selectors.getSavedArmies(state),
})

const mapDispatchToProps2 = {
  loadSavedArmies: savedArmies.actions.loadSavedArmies,
}

export const ShowSavedArmies = connect(
  mapStateToProps2,
  mapDispatchToProps2
)(ShowSavedArmiesComponent)

export const SavedArmiesDisplay = () => (
  <div className="row justify-content-center pt-3">
    <SaveSection />
    <ShowSavedArmies />
  </div>
)

interface ISavedArmyCardProps extends ISavedArmy {
  deleteArmy: (id: string) => void
}

const SavedArmyCardComponent: React.FC<ISavedArmy> = props => {
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">{props.armyName}</h5>
        <h6 className="card-subtitle mb-2 text-muted">{props.factionName}</h6>
        <p className="card-text">
          Some quick example text to build on the card title and make up the bulk of the card's content.
        </p>
        <a href="#" className="card-link">
          Load Army
        </a>
        <a href="#" className="card-link text-danger">
          Delete Army
        </a>
      </div>
    </div>
  )
}

const mapDispatchToProps3 = {
  deleteArmy: savedArmies.actions.deleteSavedArmy,
}

const SavedArmyCard = connect(
  null,
  mapDispatchToProps3
)(SavedArmyCardComponent)
