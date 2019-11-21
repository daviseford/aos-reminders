import React, { useState } from 'react'
import { connect } from 'react-redux'
import { FaLink } from 'react-icons/fa'
import { useAppStatus } from 'context/useAppStatus'
import { selectors } from 'ducks'
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
  const { isOffline } = useAppStatus()

  const [modalIsOpen, setModalIsOpen] = useState(false)

  const openModal = () => setModalIsOpen(true)
  const closeModal = () => setModalIsOpen(false)

  if (isOffline) return <></>

  return (
    <>
      <ShareButton handleClick={openModal} />

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
