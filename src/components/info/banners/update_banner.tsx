import React from 'react'
import { NotificationBanner } from 'components/info/banners/notification_banner'
import { useAppStatus } from 'context/useAppStatus'
import { logDisplay } from 'utils/analytics'

const UpdateBanner = () => {
  const { hasNewContent } = useAppStatus()
  const name = 'Content_Update_Notification'

  if (!hasNewContent) return <></>

  logDisplay(name)

  return (
    <NotificationBanner name={name} persistClose={false} variant={'warning'}>
      New content is available and will be used when all tabs for this page are closed.
    </NotificationBanner>
  )
}

export default UpdateBanner
