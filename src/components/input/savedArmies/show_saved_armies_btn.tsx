import { useAuth0 } from '@auth0/auth0-react'
import GenericButton from 'components/input/generic_button'
import { useAppStatus } from 'context/useAppStatus'
import { useSubscription } from 'context/useSubscription'
import React from 'react'
import { MdStorage } from 'react-icons/md'
import useWindowSize from 'utils/hooks/useWindowSize'
import { LocalSavedArmies } from 'utils/localStore'

interface IShowSavedArmiesBtn {
  showSavedArmies: () => void
  hideSavedArmies: () => void
  isShowingSavedArmies: boolean
}

const ShowSavedArmiesBtn: React.FC<IShowSavedArmiesBtn> = ({
  isShowingSavedArmies,
  showSavedArmies,
  hideSavedArmies,
}) => {
  const { isOnline, isOffline } = useAppStatus()
  const { isAuthenticated } = useAuth0()
  const { isSubscribed } = useSubscription()
  const { isMobile } = useWindowSize()

  if (isOnline && (!isAuthenticated || !isSubscribed)) return null
  if (isOffline && LocalSavedArmies.get().length === 0) return null

  const btnText = `${isShowingSavedArmies ? `Hide` : `Show`} Saved ${isMobile ? `` : `Armies`}`

  const handleClick = e => {
    e.preventDefault()
    return isShowingSavedArmies ? hideSavedArmies() : showSavedArmies()
  }

  return (
    <GenericButton onClick={handleClick}>
      <MdStorage className="mr-2" /> {btnText}
    </GenericButton>
  )
}

export default ShowSavedArmiesBtn
