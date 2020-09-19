import GenericButton from 'components/input/generic_button'
import { useAppStatus } from 'context/useAppStatus'
import { useSubscription } from 'context/useSubscription'
import React from 'react'
import { useAuth0 } from 'react-auth0-wrapper'
import { MdStorage } from 'react-icons/md'
import { IUseAuth0 } from 'types/auth0'
import { LocalSavedArmies } from 'utils/localStore'
import { componentWithSize } from 'utils/mapSizesToProps'

interface IShowSavedArmiesBtn {
  showSavedArmies: () => void
  hideSavedArmies: () => void
  isShowingSavedArmies: boolean
  isMobile: boolean
}

const ShowSavedArmiesBtn: React.FC<IShowSavedArmiesBtn> = ({
  isShowingSavedArmies,
  showSavedArmies,
  hideSavedArmies,
  isMobile,
}) => {
  const { isOnline, isOffline } = useAppStatus()
  const { isAuthenticated }: IUseAuth0 = useAuth0()
  const { isSubscribed } = useSubscription()

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

export default componentWithSize(ShowSavedArmiesBtn)
