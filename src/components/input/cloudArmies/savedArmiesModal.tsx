import type { RemoteArmy } from '../../../api/armyApi'
import type { Aos4ArmyDocument } from '../../../aos4/state'
import { withName } from './withName'
import GenericModal from 'components/modals/generic/generic_modal'
import { useArmyCollection } from 'context/useArmyCollection'
import { useTheme } from 'context/useTheme'
import { useEffect, useMemo, useState } from 'react'

interface SavedArmiesModalProps {
  closeModal: () => void
  currentDocument: Aos4ArmyDocument
  isOpen: boolean
  onApply: (document: Aos4ArmyDocument) => void
  /** The current document became a copy of this cloud army (saved, updated from current, or loaded). */
  onLinked?: (cloudArmyId: string) => void
  onDeleted?: (cloudArmyId: string) => void
}

const SavedArmiesModal = ({
  closeModal,
  currentDocument,
  isOpen,
  onApply,
  onDeleted,
  onLinked,
}: SavedArmiesModalProps) => {
  const {
    armies,
    collectionError,
    collectionLoading,
    configured,
    createArmy,
    deleteArmy,
    refreshArmies,
    updateArmy,
  } = useArmyCollection()
  const { theme } = useTheme()
  const [saveName, setSaveName] = useState(currentDocument.name)
  const [draftNames, setDraftNames] = useState<Record<string, string>>({})
  const [pendingLoad, setPendingLoad] = useState<RemoteArmy>()
  const [pendingDeleteId, setPendingDeleteId] = useState<string>()
  const [isMutating, setIsMutating] = useState(false)
  const [message, setMessage] = useState<string>()

  useEffect(() => {
    setDraftNames(current =>
      Object.fromEntries(armies.map(army => [army.id, current[army.id] ?? army.document.name]))
    )
  }, [armies])

  useEffect(() => {
    if (isOpen) void refreshArmies()
  }, [isOpen, refreshArmies])

  const selectedCount = useMemo(() => pendingLoad?.document.explicitSelectionIds.length ?? 0, [pendingLoad])

  const mutate = async (operation: () => Promise<void>, success: string) => {
    setIsMutating(true)
    setMessage(undefined)
    try {
      await operation()
      setMessage(success)
    } catch {
      // The collection context exposes the service error beside the controls.
    } finally {
      setIsMutating(false)
    }
  }

  const saveNew = () =>
    mutate(async () => {
      const savedDocument = withName(currentDocument, saveName)
      const created = await createArmy(savedDocument)
      onApply(savedDocument)
      onLinked?.(created.id)
    }, 'Army saved.')

  const rename = (army: RemoteArmy) =>
    mutate(async () => {
      await updateArmy(army.id, withName(army.document, draftNames[army.id] ?? army.document.name))
    }, 'Saved army renamed.')

  const updateFromCurrent = (army: RemoteArmy) =>
    mutate(async () => {
      const savedDocument = withName(currentDocument, draftNames[army.id] ?? currentDocument.name)
      await updateArmy(army.id, savedDocument)
      onApply(savedDocument)
      onLinked?.(army.id)
    }, 'Saved army updated from the current army.')

  const confirmDelete = (army: RemoteArmy) =>
    mutate(async () => {
      await deleteArmy(army.id)
      setPendingDeleteId(undefined)
      if (pendingLoad?.id === army.id) setPendingLoad(undefined)
      onDeleted?.(army.id)
    }, 'Saved army deleted.')

  return (
    <GenericModal closeModal={closeModal} isOpen={isOpen} isProcessing={isMutating} label="My Armies">
      <div className={`aos4-account-modal ${theme.text}`}>
        <div className="d-flex align-items-start justify-content-between mb-3">
          <div>
            <h2 className="h4 mb-1">My Armies</h2>
            <p className="small mb-0">Save and load AoS 4 armies across your devices.</p>
          </div>
          <button aria-label="Close saved armies" className={theme.modalDangerClass} onClick={closeModal}>
            ×
          </button>
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

        <div className="card mb-3">
          <div className={`card-body ${theme.cardBody}`}>
            <label className="fw-bold" htmlFor="saved-army-name">
              Save current army
            </label>
            <div className="input-group">
              <input
                className={`form-control ${theme.bgColor} ${theme.text}`}
                id="saved-army-name"
                maxLength={200}
                onChange={event => setSaveName(event.target.value)}
                value={saveName}
              />
              {/*
                Bootstrap 5 removed the .input-group-append wrapper: an input group's children are
                now direct flex items, and the trailing control's square inner corners come from
                `.input-group > :not(:first-child)`. The button is unchanged.
              */}
              <button
                className={theme.modalSuccessClass}
                disabled={!configured || !saveName.trim()}
                onClick={() => void saveNew()}
                type="button"
              >
                Save new
              </button>
            </div>
          </div>
        </div>

        {collectionLoading ? (
          <p role="status">Loading saved armies…</p>
        ) : armies.length === 0 ? (
          <p className="small">No cloud armies saved yet.</p>
        ) : (
          <div aria-label="Saved armies" className="list-group">
            {armies.map(army => (
              <div className={`list-group-item ${theme.cardBody} ${theme.text}`} key={army.id}>
                <label className="visually-hidden" htmlFor={`army-name-${army.id}`}>
                  Saved army name
                </label>
                <input
                  className={`form-control form-control-sm mb-2 ${theme.bgColor} ${theme.text}`}
                  id={`army-name-${army.id}`}
                  maxLength={200}
                  onChange={event =>
                    setDraftNames(current => ({ ...current, [army.id]: event.target.value }))
                  }
                  value={draftNames[army.id] ?? army.document.name}
                />
                <p className="small mb-2">
                  {army.document.explicitSelectionIds.length} selections · updated{' '}
                  {new Date(army.updatedAt).toLocaleDateString()}
                </p>
                <div className="d-flex flex-wrap">
                  <button
                    className={`${theme.genericButton} btn-sm me-2 mb-2`}
                    onClick={() => setPendingLoad(army)}
                    type="button"
                  >
                    Load
                  </button>
                  <button
                    className={`${theme.genericButton} btn-sm me-2 mb-2`}
                    onClick={() => void rename(army)}
                    type="button"
                  >
                    Rename
                  </button>
                  <button
                    className={`${theme.genericButton} btn-sm me-2 mb-2`}
                    onClick={() => void updateFromCurrent(army)}
                    type="button"
                  >
                    Update from current
                  </button>
                  {pendingDeleteId === army.id ? (
                    <>
                      <button
                        className={`${theme.modalDangerClass} btn-sm me-2 mb-2`}
                        onClick={() => void confirmDelete(army)}
                        type="button"
                      >
                        Confirm delete
                      </button>
                      <button
                        className={`${theme.genericButton} btn-sm mb-2`}
                        onClick={() => setPendingDeleteId(undefined)}
                        type="button"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      className={`${theme.modalDangerClass} btn-sm mb-2`}
                      onClick={() => setPendingDeleteId(army.id)}
                      type="button"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {pendingLoad && (
          <div className="alert alert-info mt-3" role="alert">
            <strong>Replace the current army with {pendingLoad.document.name}?</strong>
            <p className="small mb-2">
              {selectedCount} selections in {pendingLoad.document.rulesContextId}
            </p>
            <button
              className={`${theme.modalConfirmClass} btn-sm me-2`}
              onClick={() => {
                onApply(pendingLoad.document)
                onLinked?.(pendingLoad.id)
                closeModal()
              }}
              type="button"
            >
              Replace current army
            </button>
            <button
              className={`${theme.genericButton} btn-sm`}
              onClick={() => setPendingLoad(undefined)}
              type="button"
            >
              Keep current army
            </button>
          </div>
        )}
      </div>
    </GenericModal>
  )
}

export default SavedArmiesModal
