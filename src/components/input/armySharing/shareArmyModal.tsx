import type { Aos4ArmyDocument } from '../../../aos4/state'
import GenericModal from 'components/modals/generic/generic_modal'
import { useArmyCollection } from 'context/useArmyCollection'
import { useTheme } from 'context/useTheme'
import { useEffect, useRef, useState } from 'react'
import { MdCheck, MdContentCopy } from 'react-icons/md'

interface ShareArmyModalProps {
  closeModal: () => void
  document: Aos4ArmyDocument
  isOpen: boolean
}

const ShareArmyModal = ({ closeModal, document, isOpen }: ShareArmyModalProps) => {
  const { collectionError, configured, createShare } = useArmyCollection()
  const { isDark, theme } = useTheme()
  const [shareUrl, setShareUrl] = useState<string>()
  const [isCreating, setIsCreating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState<string>()
  const linkRef = useRef<HTMLInputElement>(null)

  // The confirmation is transient, matching the toolbar's Update Army. Same 2.5s, same reason.
  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 2500)
    return () => window.clearTimeout(timer)
  }, [copied])

  const create = async () => {
    setIsCreating(true)
    setCopied(false)
    setCopyError(undefined)
    try {
      setShareUrl((await createShare(document)).url)
    } catch {
      // The collection context renders the service error below.
    } finally {
      setIsCreating(false)
    }
  }

  /*
   * One handler behind three affordances: the field itself, the icon beside it, and the labelled
   * button. Selecting the text as well as writing it to the clipboard means the copy is still there
   * to take by hand when the Clipboard API is unavailable — it needs a secure context, and the
   * player may well be on a venue's http captive portal.
   */
  const copy = async () => {
    if (!shareUrl) return
    linkRef.current?.select()
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setCopyError(undefined)
    } catch {
      setCopied(false)
      setCopyError('Your browser would not let the page copy. The link is selected — copy it yourself.')
    }
  }

  return (
    <GenericModal closeModal={closeModal} isOpen={isOpen} isProcessing={isCreating} label="Share Army">
      <div className={`aos4-account-modal ${theme.text}`}>
        <div className="d-flex align-items-start justify-content-between mb-3">
          <div>
            <h2 className="h4 mb-1">Share Army</h2>
            <p className="small mb-0">
              Create a read-only link. Opening it previews a copy before replacing local work.
            </p>
          </div>
          <button
            aria-label="Close Share Army"
            className={`btn-close TapTargetOverlay flex-shrink-0 ${isDark ? 'btn-close-white' : ''}`}
            onClick={closeModal}
            type="button"
          />
        </div>

        {!configured && (
          <div className="alert alert-warning" role="alert">
            Sharing is not configured for this build.
          </div>
        )}
        {collectionError && (
          <div className="alert alert-danger" role="alert">
            {collectionError}
          </div>
        )}

        {shareUrl ? (
          <>
            <label className="fw-bold" htmlFor="share-army-url">
              Share link
            </label>
            <div className="input-group">
              {/*
               * The field is the obvious thing to reach for, so it copies too. `readOnly` rather
               * than `disabled` keeps it selectable and reachable by keyboard.
               */}
              <input
                className={`form-control CopyableLink ${theme.bgColor} ${theme.text}`}
                id="share-army-url"
                onClick={() => void copy()}
                onFocus={event => event.target.select()}
                readOnly
                ref={linkRef}
                title="Click to copy"
                value={shareUrl}
              />
              <button
                aria-label={copied ? 'Share link copied' : 'Copy share link'}
                className={`${theme.genericButton} TapTarget`}
                onClick={() => void copy()}
                title={copied ? 'Copied' : 'Copy link'}
                type="button"
              >
                {copied ? <MdCheck aria-hidden /> : <MdContentCopy aria-hidden />}
              </button>
            </div>

            <button
              className={`${theme.commitButton} d-block w-100 mt-3 TapTargetBlock`}
              onClick={() => void copy()}
              type="button"
            >
              {copied ? 'Copied' : 'Copy link'}
            </button>

            {/*
             * Announced rather than left to the label swap alone: two of the three triggers change
             * nothing a screen reader would notice on their own.
             */}
            <p className={`small mt-2 mb-0 ${theme.textMuted}`} role="status">
              {copied ? 'Link copied to your clipboard.' : copyError}
            </p>
          </>
        ) : (
          <button
            className={`${theme.commitButton} d-block w-100 TapTargetBlock`}
            disabled={!configured}
            onClick={() => void create()}
            type="button"
          >
            Create share link
          </button>
        )}
      </div>
    </GenericModal>
  )
}

export default ShareArmyModal
