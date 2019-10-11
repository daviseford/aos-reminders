import React from 'react'
import { NotificationBanner } from 'components/info/banners/notification_banner'

const AppBanner = () => (
  <NotificationBanner name="Notification_Name_here" persistClose={true} variant={'primary'}>
    Add Application Notification here
  </NotificationBanner>
)

export default AppBanner
