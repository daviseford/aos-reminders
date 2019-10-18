import React from 'react'
import { NotificationBanner } from 'components/info/banners/notification_banner'
import { useSubscription } from 'context/useSubscription'
import { ROUTES } from 'utils/env'
import { Link } from 'react-router-dom'
import { logClick } from 'utils/analytics'
import { componentWithSize } from 'utils/mapSizesToProps'

const AppBanner = componentWithSize(props => {
  const { isTinyMobile } = props
  const { isNotSubscribed } = useSubscription()
  const subscribeTxt = (
    <>
      To celebrate, subscriptions are <strong>50% off!</strong>
    </>
  )

  return (
    <NotificationBanner name="Offline_Sale_Notification" persistClose={true} variant={'info'}>
      You can now use this site <strong>offline!</strong>
      <br />
      {isNotSubscribed && (
        <Link to={ROUTES.SUBSCRIBE} onClick={() => logClick('Offline_Sale_Subscribe')}>
          {isTinyMobile ? <small>{subscribeTxt}</small> : subscribeTxt}
        </Link>
      )}
    </NotificationBanner>
  )
})

export default AppBanner
