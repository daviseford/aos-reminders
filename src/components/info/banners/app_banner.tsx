import React from 'react'
import { NotificationBanner } from 'components/info/banners/notification_banner'
import { Link } from 'react-router-dom'
import { useSubscription } from 'context/useSubscription'

const AppBanner = () => {
  const { isSubscribed } = useSubscription()
  if (isSubscribed) return null
  return (
    <NotificationBanner name="Subscribe_Nudge_01" persistClose={false} variant={'info'}>
      <p>
        We work hard to maintain our rules library and constantly add premium features for the community. You
        can help support us by subscribing!
      </p>

      <Link to="/subscribe">
        <span>Subscribe Today</span>
      </Link>
    </NotificationBanner>
  )
}

export default AppBanner
