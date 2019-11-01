import React, { useState, useMemo } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { useAuth0 } from 'react-auth0-wrapper'
import { FaSave } from 'react-icons/fa'
import ReactTooltip from 'react-tooltip'
import { useSubscription } from 'context/useSubscription'
import { useSavedArmies } from 'context/useSavedArmies'
import { useTheme } from 'context/useTheme'
import { armyHasEntries } from 'utils/armyUtils'
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

  const canSave = useMemo(() => armyHasEntries(currentArmy), [currentArmy])

  const [modalIsOpen, setModalIsOpen] = useState(false)

  const openModal = () => setModalIsOpen(true)
  const closeModal = () => setModalIsOpen(false)

  if (isOffline) return <OfflineBtn text="Save Army" />

  return (
    <>
      {!isAuthenticated && <SaveButton handleClick={handleLogin} />}

      {isAuthenticated && (!isSubscribed || !isActive) && <SubscribeBtn />}

      {isAuthenticated && isSubscribed && isActive && !canSave && <SaveButton showTooltip={true} />}

      {isAuthenticated && isSubscribed && isActive && canSave && <SaveButton handleClick={openModal} />}

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

const SaveArmyBtn = connect(
  mapStateToProps,
  null
)(SaveArmyBtnComponent)

export default SaveArmyBtn

const SubscribeBtn = () => {
  const { theme } = useTheme()
  return (
    <Link
      to={ROUTES.SUBSCRIBE}
      className={theme.genericButton}
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
  showTooltip?: boolean
}

const SaveButton = ({ handleClick = () => null, showTooltip = false }: ISaveButtonProps) => {
  const tipProps = {
    'data-for': 'cantSaveButton',
    'data-multiline': true,
    'data-tip': `Add some stuff to your army before saving!`,
    'data-type': 'warning',
  }

  return (
    <>
      <GenericButton onClick={handleClick} {...tipProps}>
        <FaSave className="mr-2" /> Save Army
      </GenericButton>
      <ReactTooltip id={`cantSaveButton`} disable={!showTooltip} />
    </>
  )
}
