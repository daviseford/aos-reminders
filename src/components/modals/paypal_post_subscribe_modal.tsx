import { LargeSpinner } from 'components/helpers/suspenseFallbacks'
import GenericButton from 'components/input/generic_button'
import GenericModal from 'components/modals/generic/generic_modal'
import Contact from 'components/page/contact'
import { useSubscription } from 'context/useSubscription'
import { useTheme } from 'context/useTheme'
import React, { useState } from 'react'
import { Link } from 'react-router'
import { ROUTES } from 'utils/env'
import { useSetInterval } from 'utils/hooks/useInterval'

interface IModalComponentProps {
  modalIsOpen: boolean
  closeModal: () => void
  retryGrant?: () => Promise<unknown>
}

const POLL_INTERVAL_MS = 1000

/**
 * How long to keep asking PayPal's webhook to land before saying so.
 *
 * The modal used to poll forever under the words "this could take up to one minute", so a grant that
 * never arrived left the buyer watching a spinner with no account of what had happened to their
 * money. Ninety seconds is well past the median 12s webhook delay the grant retry is written around.
 */
const POLL_TIMEOUT_MS = 90 * 1000
const MAX_ATTEMPTS = POLL_TIMEOUT_MS / POLL_INTERVAL_MS

export const PaypalPostSubscribeModal = ({ closeModal, modalIsOpen, retryGrant }: IModalComponentProps) => {
  const { isActive, subscriptionLoading, getSubscription } = useSubscription()
  const { theme } = useTheme()
  const [interval, setInterval] = useState<number | null>(POLL_INTERVAL_MS)
  const [attempts, setAttempts] = useState(0)

  const hasTimedOut = interval === null && !isActive

  useSetInterval(() => {
    if (subscriptionLoading) return
    if (isActive) {
      setInterval(null)
      closeModal()
      return
    }
    if (attempts >= MAX_ATTEMPTS) {
      setInterval(null)
      return
    }
    setAttempts(current => current + 1)
    // Re-send the grant each tick: the first attempt races PayPal's CREATED
    // webhook (median 12s behind the approval) and may have found no row yet
    void retryGrant?.().catch(() => undefined)
    void getSubscription()
  }, interval)

  return (
    <GenericModal isOpen={modalIsOpen} closeModal={closeModal} label="Post Paypal Subscription Modal">
      <div className="row">
        <div className={`col ${theme.text}`}>
          {hasTimedOut ? (
            /*
             * Names what is and is not known. The payment is PayPal's record, not ours — the only
             * thing that failed is our confirmation of it — so this must not imply anything was lost.
             */
            <div role="alert">
              <h4 className="mb-3">Still waiting on PayPal</h4>
              <p className="mb-1">
                PayPal has your subscription, but we have not had confirmation of it yet. Nothing has gone
                wrong with your payment.
              </p>
              <p className="mb-3">
                It usually lands within a few minutes. Your <Link to={ROUTES.PROFILE}>Profile</Link> shows the
                status, and it is worth checking there before paying again. If it has not appeared shortly,
                please get in touch.
              </p>
              <Contact size="small" />
            </div>
          ) : (
            <div role="status">
              <h4 className="mb-3">Thanks! :)</h4>
              <p className="text-center mb-1">One sec, we&apos;re verifying your PayPal transaction...</p>
              <LargeSpinner className="text-dark" />
              {/*
                It closes itself; it does not reload the application, which is what this used to
                promise. Saying the wrong thing here reads as a failure when the modal simply
                disappears.
              */}
              <p className="text-center mt-1">
                This closes itself as soon as your subscription is available. Feel free to close it and browse
                around in the meantime.
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="row text-center">
        <div className="col px-0">
          <GenericButton className={theme.modalConfirmClass} onClick={closeModal}>
            Close
          </GenericButton>
        </div>
      </div>
    </GenericModal>
  )
}
