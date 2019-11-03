import React from 'react'
import { NotificationBanner } from 'components/info/banners/notification_banner'
import { useAppStatus } from 'context/useAppStatus'

const UpdateBanner = () => {
  const { hasNewContent } = useAppStatus()
  const name = 'Content_Update_Notification'

  if (!hasNewContent) return <></>

  return (
    <NotificationBanner name={name} persistClose={false} variant={'warning'} enableLog={true}>
      Updates are available and will be used once all tabs for this page are closed.
    </NotificationBanner>
  )
}

export default UpdateBanner
