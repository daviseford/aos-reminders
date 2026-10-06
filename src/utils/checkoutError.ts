import { SubscriptionApiError } from '../api/subscriptionApi'
import type { CheckoutErrorStage, CheckoutErrorType } from 'utils/analytics'
import { AuthenticationRequiredError } from 'utils/authToken'

/**
 * Names a failed hosted-checkout hand-off in the closed `checkout_error` vocabulary.
 *
 * Only the error's class and HTTP status are read, never its message: the message can carry a URL,
 * a server-supplied sentence, or anything else a dependency chose to put there.
 */
export const checkoutErrorType = (stage: CheckoutErrorStage, error: unknown): CheckoutErrorType => {
  if (stage === 'session_response') return 'missing_url'
  if (stage === 'redirect') return 'navigation_failed'
  if (error instanceof AuthenticationRequiredError) return 'auth_required'
  if (error instanceof SubscriptionApiError) {
    if (error.status === 0) return 'network'
    if (error.status === 401 || error.status === 403) return 'unauthorized'
    if (error.status >= 400 && error.status < 500) return 'http_4xx'
    if (error.status >= 500) return 'http_5xx'
  }
  return 'unknown'
}
