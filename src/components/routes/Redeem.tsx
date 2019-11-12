import React, { useEffect, lazy, Suspense } from 'react'
import { useAuth0 } from 'react-auth0-wrapper'
import { useSubscription } from 'context/useSubscription'
import { useTheme } from 'context/useTheme'
import { logPageView } from 'utils/analytics'
import { LoadingHeader, LoadingBody } from 'components/helpers/suspenseFallbacks'
import { IUser } from 'types/user'

const Navbar = lazy(() => import('components/page/navbar'))

const Redeem: React.FC = () => {
  const { loading, user }: { loading: boolean; user: IUser } = useAuth0()
  const { getSubscription, subscription, isActive } = useSubscription()
  const { theme } = useTheme()

  useEffect(() => {
    logPageView()
  }, [])

  useEffect(() => {
    getSubscription()
  }, [getSubscription])

  if (loading) return <LoadingBody />

  return (
    <div className={`d-block ${theme.bgColor}`}>
      <div className={`${theme.headerColor} py-2`}>
        <Suspense fallback={<LoadingHeader />}>
          <Navbar />
        </Suspense>
      </div>

      <div className={`container ${theme.bgColor} px-0`}>
        Congratulations! One of your friends has decided that you deserve a subscription to AoS Reminders!
        First, you're going to need to create an account and log in. Once you've done that, we'll set your
        subscription up!
      </div>
    </div>
  )
}

export default Redeem
