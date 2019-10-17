import React from 'react'
import { NotificationBanner } from 'components/info/banners/notification_banner'
import { useAppStatus } from 'context/useAppStatus'

const UpdateBanner = () => {
  const { hasNewContent } = useAppStatus()

  if (!hasNewContent) return <></>

  return (
    <NotificationBanner name="Content_Update_Notification" persistClose={false} variant={'warning'}>
      New content is available and will be used when all tabs for this page are closed.
    </NotificationBanner>
  )
}

export default UpdateBanner
