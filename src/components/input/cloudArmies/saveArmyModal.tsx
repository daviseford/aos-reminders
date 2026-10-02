import type { Aos4ArmyDocument } from '../../../aos4/state'
import { formatSavedAt } from './armySummary'
import { withName } from './withName'
import AsyncSuccessButton from 'components/input/asyncSuccess/asyncSuccessButton'
import { useAsyncSuccess } from 'components/input/asyncSuccess/useAsyncSuccess'
import GenericModal from 'components/modals/generic/generic_modal'
import { useArmyCollection } from 'context/useArmyCollection'
import { useTheme } from 'context/useTheme'
import { useEffect, useState } from 'react'

interface SaveArmyModalProps {
  closeModal: () => void
  currentDocument: Aos4ArmyDocument
  isOpen: boolean
  onSaved: (document: Aos4ArmyDocument, cloudArmyId: string, name: string) => void
}

const SaveArmyModal = ({ closeModal, currentDocument, isOpen, onSaved }: SaveArmyModalProps) => {
  const { armies, collectionError, configured, createArmy, refreshArmies, updateArmy } = useArmyCollection()
  const { isDark, theme } = useTheme()
  const [saveName, setSaveName] = useState(currentDocument.name)
  const [isSaving, setIsSaving] = useState(false)
  const { succeeded, triggerSuccess, reset } = useAsyncSuccess()

  /*
   * The collection is fetched so the name below can be checked against it. Saving twice under one
   * name used to produce two rows with byte-identical labels and no warning, which is how a
   * collection fills up with armies nobody can tell apart.
   */
  useEffect(() => {
    if (isOpen) void refreshArmies()
  }, [isOpen, refreshArmies])

  const trimmedName = saveName.trim()
  // An army this version cannot read (#2055) is never offered for replacement: replacing it would
  // overwrite rules a newer version saved with this version's stand-in. Once the save has
  // succeeded the check is suppressed — otherwise the army it just created would warn about
  // "duplicating" itself during the success dwell.
  const existing = succeeded
    ? undefined
    : armies.find(
        army => !army.requiresUpdate && army.document.name.trim().toLowerCase() === trimmedName.toLowerCase()
      )

  const save = async (operation: () => Promise<{ id: string }>) => {
    setIsSaving(true)
    try {
      const savedDocument = withName(currentDocument, saveName)
      const saved = await operation()
      /*
       * The green/check dwell runs before the modal closes, so the player sees the save land
       * rather than watching the modal vanish. Only reached after the service answered — a
       * rejected save falls into catch and the button never turns green.
       */
      triggerSuccess(() => {
        onSaved(savedDocument, saved.id, savedDocument.name)
        closeModal()
      })
    } catch {
      // The collection context exposes the service error beside the controls.
      reset()
    } finally {
      setIsSaving(false)
    }
  }

  const saveNew = () => save(() => createArmy(withName(currentDocument, saveName)))

  const updateExisting = () => {
    if (!existing) return
    return save(() => updateArmy(existing.id, withName(currentDocument, saveName)))
  }

  return (
    <GenericModal closeModal={closeModal} isOpen={isOpen} isProcessing={isSaving} label="Save Army">
      <div className={`aos4-account-modal ${theme.text}`}>
        <div className="d-flex align-items-start justify-content-between mb-3">
          <div>
            <h2 className="h4 mb-1">Save Army</h2>
            <p className="small mb-0">Save this army to your account, on every device you sign in on.</p>
          </div>
          <button
            aria-label="Close Save Army"
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

        <form
          onSubmit={event => {
            event.preventDefault()
            void saveNew()
          }}
        >
          <label className="fw-bold" htmlFor="save-army-name">
            Army name
          </label>
          <div className="input-group">
            <input
              className={`form-control ${theme.bgColor} ${theme.text}`}
              id="save-army-name"
              maxLength={200}
              onChange={event => setSaveName(event.target.value)}
              value={saveName}
            />
            <AsyncSuccessButton
              className={`${theme.commitButton} TapTarget`}
              disabled={!configured || !trimmedName || isSaving}
              label="Save"
              succeeded={succeeded}
              successAnnouncement="Saved."
              type="submit"
            />
          </div>
        </form>

        {existing && (
          /*
           * Not a block — "Save As" exists precisely to make a second copy — but the collection is
           * the thing that pays for a careless duplicate, so the alternative is offered here rather
           * than discovered later in a list of same-named rows.
           */
          <div className="alert alert-warning mt-3">
            {/*
             * The live region wraps the message, not the control: an announced region containing a
             * focusable button is read out without focus ever reaching it.
             */}
            <div role="status">
              <p className="mb-1">
                You already have a saved army called <strong>{existing.document.name}</strong>, saved{' '}
                {formatSavedAt(existing.updatedAt)}.
              </p>
              <p className="small mb-2">Saving now adds a second army with the same name.</p>
            </div>
            <AsyncSuccessButton
              className={`${theme.destructiveButton} btn-sm TapTarget`}
              disabled={isSaving}
              label="Overwrite it instead"
              onClick={() => void updateExisting()}
              succeeded={succeeded}
              successAnnouncement="Saved."
            />
          </div>
        )}
      </div>
    </GenericModal>
  )
}

export default SaveArmyModal
