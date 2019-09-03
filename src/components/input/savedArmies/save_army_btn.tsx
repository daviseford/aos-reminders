import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { useAuth0 } from 'react-auth0-wrapper'
import { FaSave } from 'react-icons/fa'
import { useSubscription } from 'context/useSubscription'
import { factionNames, selections, realmscape } from 'ducks'
import { ISavedArmy } from 'types/savedArmy'
import { IStore } from 'types/store'
import { SaveArmyModal } from './save_army_modal'

const btnClass = `btn btn-outline-dark btn-block`
const btnContentWrapper = `d-flex align-items-center justify-content-center`

const SaveArmyBtnComponent: React.FC<ISavedArmy> = currentArmy => {
  const { isAuthenticated, loginWithRedirect } = useAuth0()
  const { isSubscribed } = useSubscription()

  const [modalIsOpen, setModalIsOpen] = useState(false)

  const openModal = () => setModalIsOpen(true)
  const closeModal = () => setModalIsOpen(false)

  const btnText = isAuthenticated ? `Save Army` : `Log in to save this army`

  return (
    <>
      {isAuthenticated && !isSubscribed ? (
        <Link to="/subscribe" className={btnClass}>
          <div className={btnContentWrapper}>
            <FaSave className="mr-2" /> {btnText}
          </div>
        </Link>
      ) : (
        <button
          className={btnClass}
          onClick={isAuthenticated && isSubscribed ? openModal : loginWithRedirect}
        >
          <div className={btnContentWrapper}>
            <FaSave className="mr-2" /> {btnText}
          </div>
        </button>
      )}

      <SaveArmyModal army={currentArmy} modalIsOpen={modalIsOpen} closeModal={closeModal} />
    </>
  )
}

const mapStateToProps = (state: IStore, ownProps) => ({
  ...ownProps,
  allyFactionNames: selections.selectors.getAllyFactionNames(state),
  allySelections: selections.selectors.getAllySelections(state),
  factionName: factionNames.selectors.getFactionName(state),
  getAllyFactionNames: selections.selectors.getAllyFactionNames(state),
  realmscape_feature: realmscape.selectors.getRealmscapeFeature(state),
  realmscape: realmscape.selectors.getRealmscape(state),
  selections: selections.selectors.getSelections(state),
})

export const SaveArmyBtn = connect(
  mapStateToProps,
  null
)(SaveArmyBtnComponent)
