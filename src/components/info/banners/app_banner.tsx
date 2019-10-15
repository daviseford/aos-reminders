import React from 'react'
import { NotificationBanner } from 'components/info/banners/notification_banner'

const AppBanner = () => {
  return (
    <NotificationBanner name="App_Notification" persistClose={false} variant={'info'}>
      Application Notification Goes Here
    </NotificationBanner>
  )
}

export default AppBanner
