import { usePrefersReducedMotion } from 'utils/hooks/usePrefersReducedMotion'

/*
 * The checkmark begins drawing 260ms after `succeeded` flips — once the green has settled — and
 * finishes at 260 + 280 = 540ms, comfortably inside the 700ms hold.
 */
const CHECK_DRAW_DELAY_MS = 260
const CHECK_DRAW_DURATION_MS = 280
const CHECK_FADE_DURATION_MS = 120

interface AsyncSuccessButtonProps {
  /**
   * The operation genuinely succeeded: the button turns green, disables itself, and the checkmark
   * draws itself stroke-first. Never set on a pending or failed operation.
   */
  succeeded: boolean
  /**
   * The idle label — e.g. "Save", "Import Army". Kept in the DOM (faded, not removed) once
   * succeeded, so the button's footprint does not jump when the checkmark takes its place.
   */
  label: string
  /** Screen-reader announcement rendered once the success state shows — e.g. "Saved." */
  successAnnouncement: string
  className?: string
  type?: 'button' | 'submit'
  disabled?: boolean
  onClick?: () => void
}

/*
 * The button half of the async success motion: a green fill and a checkmark that draws itself
 * rather than popping in. Shared by every async commit control so the sequencing lives in one
 * place — see useAsyncSuccess for the hold that follows.
 */
const AsyncSuccessButton = ({
  succeeded,
  label,
  successAnnouncement,
  className = '',
  type = 'button',
  disabled,
  onClick,
}: AsyncSuccessButtonProps) => {
  const reducedMotion = usePrefersReducedMotion()

  return (
    <>
      <button
        className={`${className} AsyncSuccessButton${succeeded ? ' AsyncSuccessButton-Succeeded' : ''}`}
        disabled={disabled || succeeded}
        onClick={onClick}
        type={type}
      >
        <span
          className="AsyncSuccessButton-Label"
          style={{ opacity: succeeded ? 0 : 1, transition: 'opacity 100ms' }}
        >
          {label}
        </span>
        <span
          aria-hidden
          className="AsyncSuccessButton-Check"
          style={{
            opacity: succeeded ? 1 : 0,
            transition: reducedMotion ? `opacity ${CHECK_FADE_DURATION_MS}ms ease-out` : 'none',
          }}
        >
          <svg fill="none" height={17} viewBox="0 0 24 24" width={17}>
            <path
              d="M20 6 9 17l-5-5"
              // Normalizes the path's length to 1 so the draw transition works without measuring
              // the path (no getTotalLength(), no ref, no post-mount effect).
              pathLength={1}
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.25}
              style={{
                strokeDasharray: 1,
                // Reduced motion pre-draws the check; the wrapper's opacity fade is the only
                // motion left.
                strokeDashoffset: reducedMotion ? 0 : succeeded ? 0 : 1,
                transition: reducedMotion
                  ? 'none'
                  : `stroke-dashoffset ${CHECK_DRAW_DURATION_MS}ms cubic-bezier(.65,0,.35,1) ${CHECK_DRAW_DELAY_MS}ms`,
              }}
            />
          </svg>
        </span>
      </button>
      {succeeded && (
        <span className="visually-hidden" role="status">
          {successAnnouncement}
        </span>
      )}
    </>
  )
}

export default AsyncSuccessButton
