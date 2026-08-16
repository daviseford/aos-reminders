import Spinner from 'components/helpers/spinner'
import { useTheme } from 'context/useTheme'
import React from 'react'
import Modal from 'react-modal'

interface IGenericModalProps {
  isProcessing?: boolean
  isOpen: boolean
  closeModal: () => void
  label: string
}

if (typeof document !== 'undefined' && document.getElementById('root')) {
  Modal.setAppElement('#root')
}

const GenericModal = ({
  children,
  closeModal,
  isOpen,
  label,
  isProcessing = false,
}: React.PropsWithChildren<IGenericModalProps>) => {
  const { isDark } = useTheme()

  return (
    <Modal
      className={isDark ? 'Modal-Dark' : 'Modal-Light'}
      contentLabel={label}
      isOpen={isOpen}
      onRequestClose={closeModal}
      overlayClassName="Modal-Overlay"
    >
      {/*
       * The content stays mounted and on screen while a request is in flight. It used to be
       * `hidden`, which `display: none`s the whole subtree: the list, the headings and any live
       * alert vanished for the duration of every mutation, and the browser dropped focus to <body>
       * because the focused control had just been removed from the layout. Dimming keeps the
       * player's place, keeps focus where it was, and still reads as busy.
       */}
      {/*
       * `px-0`: `.Modal-*` already pads itself, so the container's 15px gutters were spent twice.
       * On a 390px phone that pushed `.aos4-account-modal` past the modal's own
       * `max-width: calc(100vw - 2rem)` and left the dialog scrolling sideways by 6px.
       */}
      <div className="container px-0 ModalContent" aria-busy={isProcessing}>
        <div className={isProcessing ? 'ModalContent-Busy' : undefined}>{children}</div>
        {isProcessing && (
          <div className="ModalContent-Spinner">
            <ModalSpinner isDark={isDark} />
          </div>
        )}
      </div>
    </Modal>
  )
}

/*
 * `isDark` was declared with a default and never passed by the one call site, so the spinner always
 * rendered `text-dark` (#343a40) — and it was drawn on a transparent modal over a 90%-black scrim,
 * which composites to about #191919. That is 1.53:1, under WCAG 1.4.11's 3:1 for a meaningful
 * graphic, and it was identical in both themes.
 */
const ModalSpinner = ({ isDark = false }: { isDark?: boolean }) => (
  <div className="d-flex flex-row justify-content-center">
    <Spinner variant={isDark ? 'light-gray' : 'dark'} size="large" />
  </div>
)

export default GenericModal
