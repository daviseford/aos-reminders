import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { NotificationBanner } from 'components/info/banners/notification_banner'
import { useSubscription } from 'context/useSubscription'
import { logClick, logDisplay } from 'utils/analytics'
import { ROUTES } from 'utils/env'
import { componentWithSize } from 'utils/mapSizesToProps'

const AppBanner = componentWithSize(props => {
  const { isTinyMobile } = props
  const { isNotSubscribed } = useSubscription()
  const name = 'Offline_Sale_Notification'

  const subscribeTxt = (
    <>
      To celebrate, subscriptions are <strong>50% off!</strong>
    </>
  )

  useEffect(() => {
    logDisplay(name)
  }, [])

  return (
    <NotificationBanner name={name} persistClose={true} variant={'info'}>
      You can now use this site <strong>offline!</strong>
      <br />
      {isNotSubscribed && (
        <Link to={ROUTES.SUBSCRIBE} onClick={() => logClick(name)}>
          {isTinyMobile ? <small>{subscribeTxt}</small> : subscribeTxt}
        </Link>
      )}
    </NotificationBanner>
  )
})

export default AppBanner
