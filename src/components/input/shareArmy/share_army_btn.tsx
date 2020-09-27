import { useAuth0 } from '@auth0/auth0-react'
import GenericButton from 'components/input/generic_button'
import { ShareArmyModal } from 'components/input/shareArmy/share_army_modal'
import { useAppStatus } from 'context/useAppStatus'
import { useSubscription } from 'context/useSubscription'
import { useTheme } from 'context/useTheme'
import React, { useState } from 'react'
import { FaLink } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { centerContentClass } from 'theme/helperClasses'
import { logClick } from 'utils/analytics'
import { ROUTES } from 'utils/env'
import useLogin from 'utils/hooks/useLogin'

const ShareArmyBtn = () => {
  const { isAuthenticated } = useAuth0()
  const { isOffline } = useAppStatus()
  const { isActive } = useSubscription()
  const { login } = useLogin({ origin: 'ShareArmyBtn' })

  const [modalIsOpen, setModalIsOpen] = useState(false)

  const openModal = () => setModalIsOpen(true)
  const closeModal = () => setModalIsOpen(false)

  if (isOffline) return <></>

  return (
    <>
      {!isAuthenticated && <ShareButton handleClick={login} />}

      {isAuthenticated && !isActive && <SubscribeBtn />}

      {isActive && <ShareButton handleClick={openModal} />}

      {modalIsOpen && <ShareArmyModal modalIsOpen={modalIsOpen} closeModal={closeModal} />}
    </>
  )
}

export default ShareArmyBtn

const ShareButton = ({ handleClick }: { handleClick: () => void }) => {
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
