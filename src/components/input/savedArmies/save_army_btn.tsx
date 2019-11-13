import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { useAuth0 } from 'react-auth0-wrapper'
import { FaSave } from 'react-icons/fa'
import { useSubscription } from 'context/useSubscription'
import { useSavedArmies } from 'context/useSavedArmies'
import { useTheme } from 'context/useTheme'
import { logClick } from 'utils/analytics'
import { centerContentClass } from 'theme/helperClasses'
import { selectors } from 'ducks'
import { ISavedArmy } from 'types/savedArmy'
import { IStore, IVisibilityStore } from 'types/store'
import { SaveArmyModal } from './save_army_modal'
import { useAppStatus } from 'context/useAppStatus'
import { OfflineBtn } from 'components/helpers/suspenseFallbacks'
import { ROUTES } from 'utils/env'
import GenericButton from '../generic_button'

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
  const { isAuthenticated } = useAuth0()
  const { isSubscribed, isActive } = useSubscription()
  const { handleLogin } = useSavedArmies()

  const [modalIsOpen, setModalIsOpen] = useState(false)

  const openModal = () => setModalIsOpen(true)
  const closeModal = () => setModalIsOpen(false)

  if (isOffline) return <OfflineBtn text="Save Army" />

  return (
    <>
      {!isAuthenticated && <SaveButton handleClick={handleLogin} />}

      {isAuthenticated && (!isSubscribed || !isActive) && <SubscribeBtn />}

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
