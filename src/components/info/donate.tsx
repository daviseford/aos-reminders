import { useAppStatus } from 'context/useAppStatus'
import { useTheme } from 'context/useTheme'
import { IconContext } from 'react-icons'
import { FaCcPaypal } from 'react-icons/fa'
import { logClick } from 'utils/analytics'

export const DonateComponent = () => {
  const { isOffline } = useAppStatus()
  const { theme } = useTheme()

  const handlePaypalClick = (event: React.MouseEvent) => {
    event.preventDefault()
    logClick('DonatePayPal')
    window.open('//paypal.me/daviseford')
  }

  if (isOffline) return null

  return (
    <div className={`container ${theme.bgColor} pt-4`}>
      <div className="row justify-content-center">
        <div
          className={`col-10 col-sm-8 col-md-6 col-lg-4 col-xl-4 card ${theme.bgColor} ${theme.text} py-3`}
        >
          <div className="row d-flex justify-content-center d-print-none">
            <div className="btn-group btn-group-lg" role="group" aria-label="Donate">
              <div className="btn-group mr-2" role="group" aria-label="Donate options">
                <IconContext.Provider value={{ size: '2.2em' }}>
                  <FaCcPaypal onClick={handlePaypalClick} className="mx-2" style={{ cursor: 'pointer' }} />
                </IconContext.Provider>
              </div>
            </div>
          </div>
          <small className="text-center mt-3">
            Creating this took a lot of time and effort.
            <br />
            If you&apos;d like to thank me, buy me a beer!
          </small>
        </div>
      </div>
    </div>
  )
}
