import { useAuth0 } from '@auth0/auth0-react'
import { OfflineBtn } from 'components/helpers/suspenseFallbacks'
import GenericButton from 'components/input/generic_button'
import { SaveArmyModal } from 'components/input/savedArmies/save_army_modal'
import { useAppStatus } from 'context/useAppStatus'
import { useSubscription } from 'context/useSubscription'
import { useTheme } from 'context/useTheme'
import { selectors } from 'ducks'
import React, { useState } from 'react'
import { FaSave } from 'react-icons/fa'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { centerContentClass } from 'theme/helperClasses'
import { ISavedArmy } from 'types/savedArmy'
import { IStore, IVisibilityStore } from 'types/store'
import { logClick } from 'utils/analytics'
import { ROUTES } from 'utils/env'

interface ISaveArmyProps {
  currentArmy: ISavedArmy
  showSavedArmies: () => void
  hiddenReminders: IVisibilityStore['reminders']
}

const SaveArmyBtnComponent: React.FC<ISaveArmyProps> = ({
  currentArmy,
  showSavedArmies,
  hiddenReminders,
}) => {
  const { isOffline } = useAppStatus()
  const { isAuthenticated, loginWithRedirect } = useAuth0()
  const { isActive } = useSubscription()

  const [modalIsOpen, setModalIsOpen] = useState(false)

  const openModal = () => setModalIsOpen(true)
  const closeModal = () => setModalIsOpen(false)

  if (isOffline) return <OfflineBtn text="Save Army" />

  return (
    <>
      {!isAuthenticated && <SaveButton handleClick={loginWithRedirect} />}

      {isAuthenticated && !isActive && <SubscribeBtn />}

      {isActive && <SaveButton handleClick={openModal} />}

      {modalIsOpen && (
        <SaveArmyModal
          showSavedArmies={showSavedArmies}
          army={currentArmy}
          modalIsOpen={modalIsOpen}
          closeModal={closeModal}
          hiddenReminders={hiddenReminders}
        />
      )}
    </>
  )
}

const mapStateToProps = (state: IStore, ownProps) => ({
  ...ownProps,
  currentArmy: selectors.getCurrentArmy(state),
  hiddenReminders: selectors.getReminders(state),
})

const SaveArmyBtn = connect(mapStateToProps, null)(SaveArmyBtnComponent)

export default SaveArmyBtn

const SubscribeBtn = () => {
  const { theme } = useTheme()
  return (
    <Link
      to={ROUTES.SUBSCRIBE}
      className={theme.genericButtonBlock}
      onClick={() => logClick('SaveArmy-Subscribe')}
    >
      <div className={centerContentClass}>
        <FaSave className="mr-2" /> Save Army
      </div>
    </Link>
  )
}

interface ISaveButtonProps {
  handleClick?: () => void
}

const SaveButton = ({ handleClick = () => null }: ISaveButtonProps) => {
  return (
    <GenericButton onClick={handleClick}>
      <FaSave className="mr-2" /> Save Army
    </GenericButton>
  )
}
