import { useAuth0 } from '@auth0/auth0-react'
import GenericButton from 'components/input/generic_button'
import { ShareArmyModal } from 'components/modals/share_army_modal'
import SubscriberOnlyModal from 'components/modals/subscriber_only_modal'
import { useAppStatus } from 'context/useAppStatus'
import { useSubscription } from 'context/useSubscription'
import React, { useState } from 'react'
import { FaLink } from 'react-icons/fa'
import useLogin from 'utils/hooks/useLogin'

const ShareArmyBtn = () => {
  const { isAuthenticated } = useAuth0()
  const { isOffline } = useAppStatus()
  const { isActive } = useSubscription()
  const { login } = useLogin({ origin: 'ShareArmyBtn' })

  const [shareModalIsOpen, setShareModalIsOpen] = useState(false)
  const [subscribeModalIsOpen, setSubscribeModalIsOpen] = useState(false)

  if (isOffline) return <></>

  return (
    <>
      {!isAuthenticated && <ShareButton handleClick={login} />}

      {isAuthenticated && !isActive && <ShareButton handleClick={() => setSubscribeModalIsOpen(true)} />}

      {isActive && <ShareButton handleClick={() => setShareModalIsOpen(true)} />}

      {shareModalIsOpen && (
        <ShareArmyModal modalIsOpen={shareModalIsOpen} closeModal={() => setShareModalIsOpen(false)} />
      )}

      {subscribeModalIsOpen && (
        <SubscriberOnlyModal
          isOpen={subscribeModalIsOpen}
          featureName={'ShareLink'}
          closeModal={() => setSubscribeModalIsOpen(false)}
        />
      )}
    </>
  )
}

export default ShareArmyBtn

const ShareButton = (props: { handleClick: () => void }) => {
  return (
    <GenericButton onClick={props.handleClick}>
      <FaLink className="mr-2" /> Share
    </GenericButton>
  )
}
