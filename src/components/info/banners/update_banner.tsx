import { NotificationBanner } from 'components/info/banners/notification_banner'
import GenericButton from 'components/input/generic_button'
import { useAppStatus } from 'context/useAppStatus'
import { useTheme } from 'context/useTheme'
import React from 'react'
import { MdRefresh } from 'react-icons/md'
import { logClick } from 'utils/analytics'
import useWindowSize from 'utils/hooks/useWindowSize'

const UpdateBanner = () => {
  const { hasNewContent } = useAppStatus()
  const { isDark } = useTheme()
  const { isTinyMobile, isMobile } = useWindowSize()
  const name = 'Content_Update_Notification'

  const variant = isDark ? `dark` : `secondary`
  const btnText = isTinyMobile ? `` : `Reload`
  const btnSize = isTinyMobile ? `lg` : isMobile ? `md` : `sm`
  const btnClass = `btn btn-${btnSize} btn-primary ml-3`
  const iconClass = isTinyMobile ? `` : `mr-2`

  const handleAccept = async () => {
    logClick('ReloadContentButton')
    window.location.reload()
  }

  if (!hasNewContent) return <></>

  return (
    <NotificationBanner name={name} persistClose={false} variant={variant} enableLog={true}>
      Updates are available!
      <GenericButton onClick={handleAccept} className={btnClass}>
        <MdRefresh className={iconClass} />
        {btnText}
      </GenericButton>
    </NotificationBanner>
  )
}

export default UpdateBanner
