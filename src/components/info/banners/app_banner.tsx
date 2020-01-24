import React from 'react'
import { useTheme } from 'context/useTheme'
import { componentWithSize } from 'utils/mapSizesToProps'
import { NotificationBanner } from 'components/info/banners/notification_banner'
import { logClick } from 'utils/analytics'
import { Link } from 'react-router-dom'
import { ROUTES } from 'utils/env'

const AppBanner = componentWithSize(({ isMobile = false }) => {
  const { isDark } = useTheme()
  const name = 'Stats_2020_Release'

  return (
    <NotificationBanner
      displayOnce={true}
      enableLog={true}
      name={name}
      persistClose={true}
      variant={isDark ? `dark` : `secondary`}
    >
      <span>
        Subscribers can now access advanced usage stats{' '}
        <Link to={ROUTES.STATS} onClick={() => logClick(name)}>
          via our new Stats page.
        </Link>
      </span>
    </NotificationBanner>
  )
})

export default AppBanner

// Sale Banner
// const AppBanner = componentWithSize(props => {
//   const { isTinyMobile } = props
//   const { isNotSubscribed } = useSubscription()
//   const name = 'Offline_Sale_Notification'

//   const subscribeTxt = (
//     <>
//       To celebrate, subscriptions are <strong>50% off!</strong>
//     </>
//   )

//   useEffect(() => {
//     logDisplay(name)
//   }, [])

//   return (
//     <NotificationBanner name={name} persistClose={true} variant={'info'}>
//       You can now use this site <strong>offline!</strong>
//       <br />
//       {isNotSubscribed && (
//         <Link to={ROUTES.SUBSCRIBE} onClick={() => logClick(name)}>
//           {isTinyMobile ? <small>{subscribeTxt}</small> : subscribeTxt}
//         </Link>
//       )}
//     </NotificationBanner>
//   )
// })
