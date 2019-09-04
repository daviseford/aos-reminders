import React, { useState, useMemo } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { useAuth0 } from 'react-auth0-wrapper'
import { FaSave } from 'react-icons/fa'
import ReactTooltip from 'react-tooltip'
import { useSubscription } from 'context/useSubscription'
import { duckUtils } from 'ducks'
import { ISavedArmy } from 'types/savedArmy'
import { IStore } from 'types/store'
import { SaveArmyModal } from './save_army_modal'
import { armyHasEntries } from 'utils/armyUtils'

const btnClass = `btn btn-outline-dark btn-block`
const btnContentWrapper = `d-flex align-items-center justify-content-center`

interface ISaveArmyProps {
  showSavedArmies: () => void
  currentArmy: ISavedArmy
}

const SaveArmyBtnComponent: React.FC<ISaveArmyProps> = ({ currentArmy, showSavedArmies }) => {
  const { isAuthenticated, loginWithRedirect } = useAuth0()
  const { isSubscribed } = useSubscription()

  const canSave = useMemo(() => armyHasEntries(currentArmy), [currentArmy])

  const [modalIsOpen, setModalIsOpen] = useState(false)

  const openModal = () => setModalIsOpen(true)
  const closeModal = () => setModalIsOpen(false)

  const btnText = isAuthenticated ? `Save Army` : `Log in to save army`

  return (
    <>
      {!isAuthenticated && <SaveButton btnText={btnText} handleClick={loginWithRedirect} />}

      {isAuthenticated && !isSubscribed && <SubscribeBtn />}

      {isAuthenticated && isSubscribed && !canSave && <SaveButton btnText={btnText} showTooltip={true} />}

      {isAuthenticated && isSubscribed && canSave && <SaveButton btnText={btnText} handleClick={openModal} />}

      <SaveArmyModal
        showSavedArmies={showSavedArmies}
        army={currentArmy}
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
      />
    </>
  )
}

const mapStateToProps = (state: IStore, ownProps) => ({
  ...ownProps,
  currentArmy: duckUtils.getCurrentArmy(state),
})

export const SaveArmyBtn = connect(
  mapStateToProps,
  null
)(SaveArmyBtnComponent)

const SubscribeBtn = () => (
  <Link to="/subscribe" className={btnClass}>
    <div className={btnContentWrapper}>
      <FaSave className="mr-2" /> Save Army
    </div>
  </Link>
)

interface ISaveButtonProps {
  handleClick?: () => void
  btnText: string
  showTooltip?: boolean
}

const SaveButton = ({ handleClick = () => null, btnText, showTooltip = false }: ISaveButtonProps) => {
  const tipProps = {
    'data-for': 'cantSaveButton',
    'data-multiline': true,
    'data-tip': `Add some stuff to your army before saving!`,
    'data-type': 'warning',
  }

  return (
    <>
      <button className={btnClass} onClick={handleClick} {...tipProps}>
        <div className={btnContentWrapper}>
          <FaSave className="mr-2" /> {btnText}
        </div>
      </button>
      <ReactTooltip id={`cantSaveButton`} disable={!showTooltip} />
    </>
  )
}
