import { NotificationBanner } from 'components/info/banners/notification_banner'
import { useSubscription } from 'context/useSubscription'
import { useTheme } from 'context/useTheme'
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { logClick, logDisplay } from 'utils/analytics'
import { ROUTES } from 'utils/env'
import { componentWithSize } from 'utils/mapSizesToProps'

// const AppBanner = componentWithSize(({ isMobile = false }) => {
//   const { isDark } = useTheme()
//   const name = 'GHB_2020_Release'

//   return (
//     <NotificationBanner
//       displayOnce={true}
//       enableLog={true}
//       name={name}
//       persistClose={true}
//       variant={isDark ? `dark` : `secondary`}
//     >
//       <span>Lumineth Realmlords are live!</span>
//     </NotificationBanner>
//   )
// })

// Sale Banner
const AppBanner = componentWithSize(props => {
  // const { isTinyMobile } = props
  const { isDark } = useTheme()
  const { isNotSubscribed } = useSubscription()
  const name = 'Paypal_Launch_2020'

  const subscribeTxt = <>You can now subscribe using PayPal!</>

  useEffect(() => {
    logDisplay(name)
  }, [])

  // Only display to non-subscribers
  if (!isNotSubscribed) return <></>

  return (
    <NotificationBanner
      displayOnce={true}
      enableLog={true}
      name={name}
      persistClose={true}
      variant={isDark ? `dark` : `secondary`}
    >
      WAAAGH!&nbsp;
      <Link to={ROUTES.SUBSCRIBE} onClick={() => logClick(name)}>
        {subscribeTxt}
      </Link>
    </NotificationBanner>
  )
})

export default AppBanner
