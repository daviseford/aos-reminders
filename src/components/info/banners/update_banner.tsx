import React from 'react'
import { NotificationBanner } from 'components/info/banners/notification_banner'
import GenericButton from 'components/input/generic_button'
import { LocalStoredArmy } from 'utils/localStore'
import { useAppStatus } from 'context/useAppStatus'
import { useTheme } from 'context/useTheme'
import { MdRefresh } from 'react-icons/md'
import { componentWithSize } from 'utils/mapSizesToProps'
import { logClick } from 'utils/analytics'

const UpdateBanner = componentWithSize(({ isTinyMobile = false, isMobile = false }) => {
  const { hasNewContent } = useAppStatus()
  const { isDark } = useTheme()
  const name = 'Content_Update_Notification'

  const handleAccept = async () => {
    try {
      if (navigator && navigator.serviceWorker) {
        const waitingServiceWorker = await navigator.serviceWorker.ready

        if (waitingServiceWorker.waiting) {
          logClick('ReloadContentButton')
          LocalStoredArmy.set() // Save anything we're working on
          waitingServiceWorker.waiting.postMessage({ type: 'SKIP_WAITING' })
          window.location.reload()
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  const variant = isDark ? `dark` : `secondary`
  const btnText = isTinyMobile ? `` : `Reload`
  const btnSize = isTinyMobile ? `lg` : isMobile ? `md` : `sm`
  const btnClass = `btn btn-${btnSize} btn-primary ml-3`
  const iconClass = isTinyMobile ? `` : `mr-2`

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
})

export default UpdateBanner
