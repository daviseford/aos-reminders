import { usePrefersReducedMotion } from 'utils/hooks/usePrefersReducedMotion'
import { useCallback, useEffect, useRef, useState } from 'react'

/*
 * The drawn checkmark holds before the caller's transition proceeds (close the modal, apply the
 * army), so the success is visibly complete rather than clipped by the next screen.
 */
export const ASYNC_SUCCESS_HOLD_MS = 700
/*
 * Reduced motion skips the stroke-draw, but still acknowledges success before proceeding rather
 * than jumping straight to the result — just briefly.
 */
export const ASYNC_SUCCESS_REDUCED_HOLD_MS = 300

/*
 * Orchestrates the success sequence shared by the async commit controls (Save Army, Import Army,
 * rename): `succeeded` drives the button's green fill and stroke-drawn checkmark, and
 * `triggerSuccess` holds for the duration — shorter under `prefers-reduced-motion` — before running
 * whatever the caller's flow does next.
 *
 * `succeeded` is a one-way flip for the life of the instance: every caller unmounts or resets its
 * own state as part of leaving the step. A failed operation never reaches `triggerSuccess` at all,
 * so the button can never show green on an error.
 */
export const useAsyncSuccess = () => {
  const reducedMotion = usePrefersReducedMotion()
  const [succeeded, setSucceeded] = useState(false)
  const holdTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const clearHold = useCallback(() => {
    if (holdTimer.current === undefined) return
    clearTimeout(holdTimer.current)
    holdTimer.current = undefined
  }, [])

  // Cleanup only: a pending hold must not call back into a component that has already unmounted
  // (a Cancel press, a modal close) — that is what makes cancelling mid-hold safe.
  useEffect(() => clearHold, [clearHold])

  const triggerSuccess = useCallback(
    (onSettled: () => void) => {
      setSucceeded(true)
      clearHold()
      holdTimer.current = setTimeout(
        () => {
          holdTimer.current = undefined
          onSettled()
        },
        reducedMotion ? ASYNC_SUCCESS_REDUCED_HOLD_MS : ASYNC_SUCCESS_HOLD_MS
      )
    },
    [clearHold, reducedMotion]
  )

  const reset = useCallback(() => {
    clearHold()
    setSucceeded(false)
  }, [clearHold])

  return { succeeded, reducedMotion, triggerSuccess, reset }
}
