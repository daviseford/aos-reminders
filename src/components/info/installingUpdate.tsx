import Spinner from 'components/helpers/spinner'
import { useAppStatus } from 'context/useAppStatus'
import { useTheme } from 'context/useTheme'
import { useEffect, useRef, useState } from 'react'
import Modal from 'react-modal'
import {
  applyWaitingUpdate,
  canInstallUpdates,
  installStallBackoffRemainingMs,
} from '../../bootstrap/registerServiceWorker'

/*
 * The modal's own deadline, independent of the registration controller.
 *
 * `applyWaitingUpdate` always ends in a reload, and reaches it unconditionally after two
 * ACTIVATION_TIMEOUT_MS windows, so this outlasts both and should never be the path that fires. It is
 * the last guarantee that a modal which cannot be dismissed never outlives its own explanation.
 */
export const INSTALL_FALLBACK_RELOAD_MS = 15 * 1000

/*
 * Above everything else the app can put on screen.
 *
 * react-modal appends its portal to <body> when the component mounts, and this one mounts with the
 * app -- so its portal sits *before* any Save/Import/Print/Share/checkout modal opened later, and
 * with equal stacking those later overlays would paint over it. The loading splash (1050) and
 * Bootstrap's own layers (dropdowns 1000 up to toasts 1090) sit above an unstacked overlay too. The
 * install cannot be deferred, so it has to be the thing that is visible.
 */
export const INSTALLING_UPDATE_Z_INDEX = 2000

const reloadPage = () => window.location.reload()

if (typeof document !== 'undefined' && document.getElementById('root')) {
  Modal.setAppElement('#root')
}

interface IInstallingUpdateProps {
  /** Injected in tests. Defaults to whether this tab has a registration (false under rollback). */
  isEnabled?: boolean
  /** Injected in tests. Defaults to the real registration's activation call. */
  onApply?: () => void
  /** Injected in tests. Defaults to a full page reload. */
  reload?: () => void
  /** Injected in tests. Defaults to the time left in this tab's stall backoff. */
  stallBackoffRemainingMs?: () => number
}

/**
 * Installs a waiting build the moment one is announced, behind a modal that cannot be dismissed.
 *
 * There is no prompt and no deferral: every open tab hears `hasNewContent` (the registration
 * broadcasts it), shows this, and asks the waiting worker to take over. Activation starts from this
 * component's effect, after the modal has committed, rather than from the registration callback, so
 * no tab reloads before it has said why. Unsaved input outside the army document -- a half-typed
 * save name, an import paste, an open checkout -- is lost when the reload lands. That is the accepted
 * cost of applying updates automatically (#2046); the army document itself is already persisted.
 *
 * Two things hold it shut, neither of them about what the user is doing: a tab carrying the rollback
 * marker never installs, and a tab whose previous install stalled waits out the rest of
 * INSTALL_STALL_BACKOFF_MS and then opens on its own.
 */
export const InstallingUpdate = ({
  isEnabled = canInstallUpdates,
  onApply = applyWaitingUpdate,
  reload = reloadPage,
  stallBackoffRemainingMs = installStallBackoffRemainingMs,
}: IInstallingUpdateProps) => {
  const { hasNewContent } = useAppStatus()
  const { isDark, theme } = useTheme()
  const [backoffMs, setBackoffMs] = useState(stallBackoffRemainingMs)
  const isOpen = isEnabled && hasNewContent && backoffMs === 0
  // `hasNewContent` latches true and the reload is what ends it, so this only ever starts once.
  const hasStarted = useRef(false)
  const fallbackTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(fallbackTimer.current), [])

  /*
   * End the backoff in this page rather than on the next load. An installed PWA can stay open for
   * days, and the hourly poll raises nothing for a worker that is already waiting, so without this a
   * stalled tab would never try again.
   */
  useEffect(() => {
    if (backoffMs === 0) return
    const timer = setTimeout(() => setBackoffMs(0), backoffMs)
    return () => clearTimeout(timer)
  }, [backoffMs])

  useEffect(() => {
    if (!isOpen || hasStarted.current) return
    hasStarted.current = true
    fallbackTimer.current = setTimeout(reload, INSTALL_FALLBACK_RELOAD_MS)
    onApply()
  }, [isOpen, onApply, reload])

  return (
    <Modal
      className={isDark ? 'Modal-Dark' : 'Modal-Light'}
      contentLabel="Installing updates"
      isOpen={isOpen}
      overlayClassName="Modal-Overlay d-print-none"
      role="alertdialog"
      shouldCloseOnEsc={false}
      shouldCloseOnOverlayClick={false}
      style={{ overlay: { zIndex: INSTALLING_UPDATE_Z_INDEX } }}
    >
      <div className="container px-0 ModalContent aos4-confirm-modal" aria-busy="true">
        <p className={`${theme.text} text-center mb-3`}>Installing updates, one moment</p>
        <Spinner variant={isDark ? 'light-gray' : 'dark'} size="large" />
      </div>
    </Modal>
  )
}
