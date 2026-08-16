import type { RemoteArmy } from '../../../api/armyApi'
import type { Aos4ArmyDocument } from '../../../aos4/state'
import { describeCloudArmy } from './armySummary'
import { withName } from './withName'
import GenericModal from 'components/modals/generic/generic_modal'
import { useArmyCollection } from 'context/useArmyCollection'
import { useTheme } from 'context/useTheme'
import { useEffect, useState } from 'react'

interface SavedArmiesModalProps {
  closeModal: () => void
  isOpen: boolean
  /** The cloud army the on-screen document is a copy of, so its row can say so. */
  linkedCloudArmyId?: string
  onApply: (document: Aos4ArmyDocument) => void
  /** The current document became a copy of this cloud army, and is exactly `document`. */
  onLinked?: (cloudArmyId: string, name: string, document: Aos4ArmyDocument) => void
  onDeleted?: (cloudArmyId: string) => void
}

/*
 * One decision at a time. `load` and `delete` each swap the row's action strip for a confirmation
 * *in that row*; `rename` swaps it for an edit field. Holding them in one value rather than
 * independent pieces of state is what makes them mutually exclusive — the previous version could
 * have a load confirmation open on one row and a delete confirmation on another, on top of a stale
 * success alert.
 */
type PendingKind = 'load' | 'delete' | 'rename'
interface PendingAction {
  id: string
  kind: PendingKind
}

const SavedArmiesModal = ({
  closeModal,
  isOpen,
  linkedCloudArmyId,
  onApply,
  onDeleted,
  onLinked,
}: SavedArmiesModalProps) => {
  const { armies, collectionError, collectionLoading, configured, deleteArmy, refreshArmies, updateArmy } =
    useArmyCollection()
  const { isDark, theme } = useTheme()
  const [pending, setPending] = useState<PendingAction>()
  const [renameDraft, setRenameDraft] = useState('')
  const [isMutating, setIsMutating] = useState(false)
  const [message, setMessage] = useState<string>()

  useEffect(() => {
    if (isOpen) void refreshArmies()
  }, [isOpen, refreshArmies])

  /*
   * A report of what just happened must never outlive the thing it describes. Opening any new
   * decision clears it, so the player is never reading "Army saved." while looking at a delete
   * confirmation for a different army.
   */
  const openPending = (id: string, kind: PendingKind, currentName = '') => {
    setMessage(undefined)
    setRenameDraft(currentName)
    setPending({ id, kind })
  }

  const mutate = async (operation: () => Promise<void>, success: string) => {
    setIsMutating(true)
    setMessage(undefined)
    try {
      await operation()
      setPending(undefined)
      setMessage(success)
    } catch {
      // The collection context exposes the service error beside the controls.
    } finally {
      setIsMutating(false)
    }
  }

  const rename = (army: RemoteArmy) =>
    mutate(async () => {
      await updateArmy(army.id, withName(army.document, renameDraft))
    }, `Renamed to ${renameDraft.trim()}.`)

  const confirmDelete = (army: RemoteArmy) =>
    mutate(async () => {
      await deleteArmy(army.id)
      onDeleted?.(army.id)
    }, `Deleted ${army.document.name}.`)

  const confirmLoad = (army: RemoteArmy) => {
    onApply(army.document)
    onLinked?.(army.id, army.document.name, army.document)
    closeModal()
  }

  const rowButton = `${theme.genericButton} btn-sm TapTarget`
  const cancelButton = `${theme.genericButton} btn-sm TapTarget`
  /*
   * Filled, because these are the controls that commit — outline is for everything reversible. Both
   * slots are theme-invariant by construction (see `invariantButtons` in theme/helperClasses), so a
   * confirmation reads with the same weight in light and dark.
   */
  const commitButton = `${theme.commitButton} btn-sm TapTarget`
  const destroyButton = `${theme.destructiveButton} btn-sm TapTarget`

  const renderActions = (army: RemoteArmy) => {
    const isPending = pending?.id === army.id

    if (isPending && pending.kind === 'rename') {
      return (
        <form
          className="CloudArmyConfirm"
          onSubmit={event => {
            event.preventDefault()
            void rename(army)
          }}
        >
          <label className="visually-hidden" htmlFor={`army-name-${army.id}`}>
            New name for {army.document.name}
          </label>
          <input
            autoFocus
            className={`form-control form-control-sm ${theme.bgColor} ${theme.text}`}
            id={`army-name-${army.id}`}
            maxLength={200}
            onChange={event => setRenameDraft(event.target.value)}
            value={renameDraft}
          />
          <div className="CloudArmyActions mt-2">
            <button
              className={commitButton}
              disabled={isMutating || !renameDraft.trim() || renameDraft.trim() === army.document.name}
              type="submit"
            >
              Save name
            </button>
            <button className={cancelButton} onClick={() => setPending(undefined)} type="button">
              Cancel
            </button>
          </div>
        </form>
      )
    }

    if (isPending && pending.kind !== 'rename') {
      /*
       * Every confirmation renders here, inside the row it belongs to. The version this replaced put
       * the load confirmation after the whole list, where with eight saved armies it landed 198px
       * below the modal on a desktop and 822px below on a phone — so "Load" looked like it did
       * nothing. It also sat in a Bootstrap `alert-info`, whose light background is the same in both
       * themes, so the outline-light buttons on it measured 1.17:1 in dark theme.
       */
      const confirmations = {
        load: {
          prompt: `Load ${army.document.name}?`,
          detail: 'The army on screen is replaced. Anything unsaved on it is lost.',
          action: 'Load this army',
          className: commitButton,
          run: () => confirmLoad(army),
        },
        delete: {
          prompt: `Delete ${army.document.name}?`,
          detail: 'It is removed from your account on every device. This cannot be undone.',
          action: 'Delete this army',
          className: destroyButton,
          run: () => void confirmDelete(army),
        },
      }[pending.kind]

      return (
        <div aria-label={confirmations.prompt} className="CloudArmyConfirm" role="group">
          <p className="mb-1 fw-bold">{confirmations.prompt}</p>
          <p className={`small mb-2 ${theme.textMuted}`}>{confirmations.detail}</p>
          <div className="CloudArmyActions">
            <button
              autoFocus
              className={confirmations.className}
              disabled={isMutating}
              onClick={confirmations.run}
              type="button"
            >
              {confirmations.action}
            </button>
            <button className={cancelButton} onClick={() => setPending(undefined)} type="button">
              Cancel
            </button>
          </div>
        </div>
      )
    }

    return (
      <div className="CloudArmyActions">
        <button className={rowButton} onClick={() => openPending(army.id, 'load')} type="button">
          Load
        </button>
        <button
          className={rowButton}
          onClick={() => openPending(army.id, 'rename', army.document.name)}
          type="button"
        >
          Rename
        </button>
        {/*
         * Pushed away from the three save-shaped actions rather than tinted red. Separation is what
         * stops a mis-tap on a phone, where these wrap to two lines; the colour is spent on the
         * confirmation instead, so nothing is loud until something is about to be destroyed.
         */}
        <button
          className={`${rowButton} CloudArmyDelete`}
          onClick={() => openPending(army.id, 'delete')}
          type="button"
        >
          Delete
        </button>
      </div>
    )
  }

  return (
    <GenericModal closeModal={closeModal} isOpen={isOpen} isProcessing={isMutating} label="My Armies">
      <div className={`aos4-account-modal ${theme.text}`}>
        <div className="d-flex align-items-start justify-content-between mb-3">
          <div>
            <h2 className="h4 mb-1">My Armies</h2>
            <p className="small mb-0">Load a saved army, or manage the ones on your account.</p>
          </div>
          {/*
           * `btn-close`, the same control the notification banner uses. It was `theme.modalDangerClass`,
           * which is a filled red button in dark theme — making Close the loudest control in the modal
           * and visually identical to Delete.
           */}
          <button
            aria-label="Close My Armies"
            className={`btn-close TapTargetOverlay flex-shrink-0 ${isDark ? 'btn-close-white' : ''}`}
            onClick={closeModal}
            type="button"
          />
        </div>

        {!configured && (
          <div className="alert alert-warning" role="alert">
            Cloud armies are not configured for this build.
          </div>
        )}
        {collectionError && (
          <div className="alert alert-danger" role="alert">
            {collectionError}
          </div>
        )}
        {message && (
          <div className="alert alert-success" role="status">
            {message}
          </div>
        )}

        {collectionLoading && armies.length === 0 ? (
          <p role="status">Loading saved armies…</p>
        ) : armies.length === 0 ? (
          <div className="CloudArmyEmpty">
            <p className="mb-1 fw-bold">No armies saved yet.</p>
            <p className={`small mb-0 ${theme.textMuted}`}>
              Build an army, then choose <strong>Save Army</strong> in the toolbar. It will be here on every
              device you sign in on.
            </p>
          </div>
        ) : (
          <ul aria-label="Saved armies" className="list-group">
            {armies.map(army => (
              <li className={`list-group-item ${theme.cardBody} ${theme.text}`} key={army.id}>
                <div className="d-flex align-items-baseline flex-wrap gap-2">
                  <h3 className="h6 mb-0">{army.document.name}</h3>
                  {army.id === linkedCloudArmyId && (
                    /*
                     * Plain text, not a badge: this is a state readout rather than an attention
                     * marker, and the saturated tones stay reserved for meaning elsewhere.
                     */
                    <span className={`small fw-bold ${theme.textMuted}`}>On screen now</span>
                  )}
                </div>
                <p className={`small mb-2 ${theme.textMuted}`}>
                  {describeCloudArmy(army.document, army.updatedAt)}
                </p>
                {renderActions(army)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </GenericModal>
  )
}

export default SavedArmiesModal
