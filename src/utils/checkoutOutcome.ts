import { useSyncExternalStore } from 'react'

/**
 * What a return from a hosted checkout meant.
 *
 * `handleStripeCheckout` reads the outcome out of the query string and immediately scrubs those
 * params from the URL, so the only record of a completed purchase is gone by the time any route
 * renders. That is why the buyer used to land on a page identical to the one they would have seen by
 * abandoning checkout. This store keeps the answer alive for the one render that has to report it.
 *
 * It is a store rather than a prop because the parse happens once in App's mount effect, while the
 * screen that shows the result is a lazily-loaded route that may not have mounted yet.
 */
export type CheckoutOutcome =
  { kind: 'subscribed' } | { kind: 'gifted'; quantity: number } | { kind: 'canceled' }

let outcome: CheckoutOutcome | null = null
const listeners = new Set<() => void>()

const emit = () => listeners.forEach(listener => listener())

export const setCheckoutOutcome = (next: CheckoutOutcome | null) => {
  outcome = next
  emit()
}

/** Called when the banner is dismissed, so a later navigation cannot resurrect a stale confirmation. */
export const clearCheckoutOutcome = () => setCheckoutOutcome(null)

const subscribe = (onStoreChange: () => void) => {
  listeners.add(onStoreChange)
  return () => void listeners.delete(onStoreChange)
}

const getSnapshot = () => outcome

/** Reads the current outcome outside React. Exists for tests and for non-component callers. */
export const readCheckoutOutcome = (): CheckoutOutcome | null => outcome

export const useCheckoutOutcome = (): CheckoutOutcome | null =>
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
