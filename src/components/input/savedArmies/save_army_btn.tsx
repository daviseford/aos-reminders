import { useAuth0 } from '@auth0/auth0-react'
import { OfflineBtn } from 'components/helpers/suspenseFallbacks'
import GenericButton from 'components/input/generic_button'
import SubscriberOnlyModal from 'components/input/generic_modals/subscriber_only_modal'
import { SaveArmyModal } from 'components/input/savedArmies/save_army_modal'
import { useAppStatus } from 'context/useAppStatus'
import { useSubscription } from 'context/useSubscription'
import React, { useState } from 'react'
import { FaSave } from 'react-icons/fa'
import useLogin from 'utils/hooks/useLogin'

interface ISaveArmyProps {
  showSavedArmies: () => void
}

const SaveArmyBtn: React.FC<ISaveArmyProps> = ({ showSavedArmies }) => {
  const { isOffline } = useAppStatus()
  const { isAuthenticated } = useAuth0()
  const { isActive } = useSubscription()
  const { login } = useLogin({ origin: 'SaveArmyBtn' })

  const [saveModalIsOpen, setSaveModalIsOpen] = useState(false)
  const [subscribeModalIsOpen, setSubscribeModalIsOpen] = useState(false)

  if (isOffline) return <OfflineBtn text="Save Army" />

  return (
    <>
      {!isAuthenticated && <SaveButton handleClick={login} />}

      {isAuthenticated && !isActive && <SaveButton handleClick={() => setSubscribeModalIsOpen(true)} />}

      {isActive && <SaveButton handleClick={() => setSaveModalIsOpen(true)} />}

      {saveModalIsOpen && (
        <SaveArmyModal
          showSavedArmies={showSavedArmies}
          modalIsOpen={saveModalIsOpen}
          closeModal={() => setSaveModalIsOpen(false)}
        />
      )}
      {subscribeModalIsOpen && (
        <SubscriberOnlyModal
          isOpen={subscribeModalIsOpen}
          featureName={'SaveArmy'}
          closeModal={() => setSubscribeModalIsOpen(false)}
        />
      )}
    </>
  )
}

export default SaveArmyBtn

const SaveButton = (props: { handleClick: () => void }) => {
  return (
    <GenericButton onClick={props.handleClick}>
      <FaSave className="mr-2" /> Save Army
    </GenericButton>
  )
}
