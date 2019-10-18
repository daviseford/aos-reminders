import React from 'react'
import { NotificationBanner } from 'components/info/banners/notification_banner'
import { useSubscription } from 'context/useSubscription'
import { ROUTES } from 'utils/env'
import { Link } from 'react-router-dom'

const AppBanner = () => {
  const { isNotSubscribed } = useSubscription()

  return (
    <NotificationBanner name="Offline_Sale_Notification" persistClose={true} variant={'info'}>
      You can now use this site <strong>offline!</strong>
      <br />
      {isNotSubscribed && (
        <Link to={ROUTES.SUBSCRIBE}>
          <small>
            To celebrate, subscriptions are <strong>50% off!</strong>
          </small>
        </Link>
      )}
    </NotificationBanner>
  )
}

export default AppBanner
