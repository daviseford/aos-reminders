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
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { centerContentClass } from 'theme/helperClasses'
import { logClick } from 'utils/analytics'
import { ROUTES } from 'utils/env'
import useLogin from 'utils/hooks/useLogin'

interface ISaveArmyProps {
  showSavedArmies: () => void
}

const SaveArmyBtn: React.FC<ISaveArmyProps> = ({ showSavedArmies }) => {
  const { isOffline } = useAppStatus()
  const { isAuthenticated } = useAuth0()
  const { isActive } = useSubscription()
  const { login } = useLogin({ origin: 'SaveArmyBtn' })

  const currentArmy = useSelector(selectors.selectCurrentArmy)
  const hiddenReminders = useSelector(selectors.selectReminders)

  const [modalIsOpen, setModalIsOpen] = useState(false)

  const openModal = () => setModalIsOpen(true)
  const closeModal = () => setModalIsOpen(false)

  if (isOffline) return <OfflineBtn text="Save Army" />

  return (
    <>
      {!isAuthenticated && <SaveButton handleClick={login} />}

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

const SaveButton = ({ handleClick }: { handleClick: () => void }) => {
  return (
    <GenericButton onClick={handleClick}>
      <FaSave className="mr-2" /> Save Army
    </GenericButton>
  )
}
