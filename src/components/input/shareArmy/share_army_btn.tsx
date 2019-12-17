import React, { useState } from 'react'
import { useAuth0 } from 'react-auth0-wrapper'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { FaLink } from 'react-icons/fa'
import { useAppStatus } from 'context/useAppStatus'
import { useSubscription } from 'context/useSubscription'
import { useTheme } from 'context/useTheme'
import { centerContentClass } from 'theme/helperClasses'
import { selectors } from 'ducks'
import { logClick } from 'utils/analytics'
import { ROUTES } from 'utils/env'
import GenericButton from 'components/input/generic_button'
import { ShareArmyModal } from 'components/input/shareArmy/share_army_modal'
import { ISavedArmy } from 'types/savedArmy'
import { IStore, IVisibilityStore } from 'types/store'

interface IShareArmyProps {
  currentArmy: ISavedArmy
  showSavedArmies: () => void
  hiddenReminders: IVisibilityStore['reminders']
}

const ShareArmyBtnComponent: React.FC<IShareArmyProps> = ({
  currentArmy,
  showSavedArmies,
  hiddenReminders,
}) => {
  const { isAuthenticated, loginWithRedirect } = useAuth0()
  const { isOffline } = useAppStatus()
  const { isActive } = useSubscription()

  const [modalIsOpen, setModalIsOpen] = useState(false)

  const openModal = () => setModalIsOpen(true)
  const closeModal = () => setModalIsOpen(false)

  if (isOffline) return <></>

  return (
    <>
      {!isAuthenticated && <ShareButton handleClick={loginWithRedirect} />}

      {isAuthenticated && !isActive && <SubscribeBtn />}

      {isActive && <ShareButton handleClick={openModal} />}

      {modalIsOpen && (
        <ShareArmyModal
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

const ShareArmyBtn = connect(mapStateToProps, null)(ShareArmyBtnComponent)

export default ShareArmyBtn

interface IShareButtonProps {
  handleClick?: () => void
}

const ShareButton = ({ handleClick = () => null }: IShareButtonProps) => {
  return (
    <GenericButton onClick={handleClick}>
      <FaLink className="mr-2" /> Share
    </GenericButton>
  )
}

const SubscribeBtn = () => {
  const { theme } = useTheme()
  return (
    <Link
      to={ROUTES.SUBSCRIBE}
      className={theme.genericButtonBlock}
      onClick={() => logClick('ShareLink-Subscribe')}
    >
      <div className={centerContentClass}>
        <FaLink className="mr-2" /> Share
      </div>
    </Link>
  )
}
