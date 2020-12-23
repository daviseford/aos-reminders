import { LinkNewTab } from 'components/helpers/link'
import { NotificationBanner } from 'components/info/banners/notification_banner'
import { useTheme } from 'context/useTheme'
import React from 'react'

const AppBanner = () => {
  const { isDark } = useTheme()
  const name = 'v4.0.0-Initial-Release'

  return (
    <NotificationBanner
      displayOnce={true}
      enableLog={true}
      name={name}
      persistClose={true}
      variant={isDark ? `warning` : `warning`}
    >
      <span>
        <strong>NEW!</strong> We've just released v4.0.0! Take a minute to&nbsp;
        <LinkNewTab
          href={'https://daviseford.com/blog/2020/12/23/whats-new-in-aos-reminders-v4.html'}
          label={"What's New in AoS Reminders v4"}
        >
          read the changelog.
        </LinkNewTab>
      </span>
    </NotificationBanner>
  )
}

// Sale Banner
// const AppBanner = () => {
//   const { isDark } = useTheme()
//   const { isNotSubscribed } = useSubscription()
//   const name = 'Paypal_Launch_2020'

//   const subscribeTxt = <>You can now subscribe using PayPal!</>

//   useEffect(() => {
//     logDisplay(name)
//   }, [])

//   // Only display to non-subscribers
//   if (!isNotSubscribed) return <></>

//   return (
//     <NotificationBanner
//       displayOnce={true}
//       enableLog={true}
//       name={name}
//       persistClose={true}
//       variant={isDark ? `dark` : `secondary`}
//     >
//       WAAAGH!&nbsp;
//       <Link to={ROUTES.SUBSCRIBE} onClick={() => logClick(name)}>
//         {subscribeTxt}
//       </Link>
//     </NotificationBanner>
//   )
// }

export default AppBanner
