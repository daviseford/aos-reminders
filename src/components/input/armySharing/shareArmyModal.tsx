import type { Aos4ArmyDocument } from '../../../aos4/state'
import GenericModal from 'components/modals/generic/generic_modal'
import { useArmyCollection } from 'context/useArmyCollection'
import { useTheme } from 'context/useTheme'
import { useState } from 'react'

interface ShareArmyModalProps {
  closeModal: () => void
  document: Aos4ArmyDocument
  isOpen: boolean
}

const ShareArmyModal = ({ closeModal, document, isOpen }: ShareArmyModalProps) => {
  const { collectionError, configured, createShare } = useArmyCollection()
  const { theme } = useTheme()
  const [shareUrl, setShareUrl] = useState<string>()
  const [isCreating, setIsCreating] = useState(false)
  const [copied, setCopied] = useState(false)

  const create = async () => {
    setIsCreating(true)
    setCopied(false)
    try {
      setShareUrl((await createShare(document)).url)
    } catch {
      // The collection context renders the service error below.
    } finally {
      setIsCreating(false)
    }
  }

  const copy = async () => {
    if (!shareUrl) return
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
    } catch {
      setCopied(false)
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
          <button aria-label="Close share army" className={theme.modalDangerClass} onClick={closeModal}>
            ×
          </button>
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
            <label className="font-weight-bold" htmlFor="share-army-url">
              Share link
            </label>
            <input
              className={`form-control ${theme.bgColor} ${theme.text}`}
              id="share-army-url"
              readOnly
              value={shareUrl}
            />
            <button className={`${theme.modalConfirmClass} btn-block mt-3`} onClick={() => void copy()}>
              {copied ? 'Copied' : 'Copy link'}
            </button>
          </>
        ) : (
          <button
            className={`${theme.modalSuccessClass} btn-block`}
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
