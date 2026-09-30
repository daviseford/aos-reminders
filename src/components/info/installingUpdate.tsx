import Spinner from 'components/helpers/spinner'
import { useAppStatus } from 'context/useAppStatus'
import { useTheme } from 'context/useTheme'
import { useEffect, useRef, useState } from 'react'
import Modal from 'react-modal'
import { applyWaitingUpdate, hasInstallRecentlyStalled } from '../../bootstrap/registerServiceWorker'

/*
 * The modal's own deadline, independent of the registration controller.
 *
 * `applyWaitingUpdate` always ends in a reload, and reaches it unconditionally after two
 * ACTIVATION_TIMEOUT_MS windows, so this outlasts both and should never be the path that fires. It
 * covers a tab with no controller to reach at all -- registration disabled for a rollback, or
 * workbox-window never loaded -- which can still hear another tab's update broadcast. A modal that
 * cannot be dismissed must never be able to outlive its own explanation.
 */
export const INSTALL_FALLBACK_RELOAD_MS = 15 * 1000

const reloadPage = () => window.location.reload()

if (typeof document !== 'undefined' && document.getElementById('root')) {
  Modal.setAppElement('#root')
}

interface IInstallingUpdateProps {
  /** Injected in tests. Defaults to the registration's per-tab stall backoff. */
  isInstallSuppressed?: () => boolean
  /** Injected in tests. Defaults to the real registration's activation call. */
  onApply?: () => void
  /** Injected in tests. Defaults to a full page reload. */
  reload?: () => void
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
 * The one exception is failure backoff: a tab whose previous install stalled does not retry at once.
 */
export const InstallingUpdate = ({
  isInstallSuppressed = hasInstallRecentlyStalled,
  onApply = applyWaitingUpdate,
  reload = reloadPage,
}: IInstallingUpdateProps) => {
  const { hasNewContent } = useAppStatus()
  const { isDark, theme } = useTheme()
  /*
   * A tab whose last install ran out of time stays put for INSTALL_STALL_BACKOFF_MS, even when
   * another tab announces the update. Read once: the stall is recorded just before a reload, so it
   * cannot change during this page's life.
   */
  const [isSuppressed] = useState(isInstallSuppressed)
  const isOpen = hasNewContent && !isSuppressed
  // `hasNewContent` latches true and the reload is what ends it, so this only ever starts once.
  const hasStarted = useRef(false)
  const fallbackTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(fallbackTimer.current), [])

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
    >
      <div className="container px-0 ModalContent aos4-confirm-modal" aria-busy="true">
        <p className={`${theme.text} text-center mb-3`}>Installing updates, one moment</p>
        <Spinner variant={isDark ? 'light-gray' : 'dark'} size="large" />
      </div>
    </Modal>
  )
}
