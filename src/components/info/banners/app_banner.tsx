import { NotificationBanner } from 'components/info/banners/notification_banner'
import { useTheme } from 'context/useTheme'

const AppBanner = () => {
  const { isDark } = useTheme()
  const name = '2024-goodbye'

  return (
    <NotificationBanner
      displayOnce={false}
      enableLog={true}
      name={name}
      persistClose={true}
      variant={isDark ? `warning` : `warning`}
    >
      <span>
        AoS Reminders will <strong>not</strong> be updated to AoS 4th Edition. This website is no longer
        actively maintained. <a href="/goodbye">Read more here</a>
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
