import type { Aos4ArmyDocument } from '../../../aos4/state'
import { withName } from './withName'
import GenericModal from 'components/modals/generic/generic_modal'
import { useArmyCollection } from 'context/useArmyCollection'
import { useTheme } from 'context/useTheme'
import { useState } from 'react'

interface SaveArmyModalProps {
  closeModal: () => void
  currentDocument: Aos4ArmyDocument
  isOpen: boolean
  onSaved: (document: Aos4ArmyDocument, cloudArmyId: string) => void
}

const SaveArmyModal = ({ closeModal, currentDocument, isOpen, onSaved }: SaveArmyModalProps) => {
  const { collectionError, configured, createArmy } = useArmyCollection()
  const { theme } = useTheme()
  const [saveName, setSaveName] = useState(currentDocument.name)
  const [isSaving, setIsSaving] = useState(false)

  const saveNew = async () => {
    setIsSaving(true)
    try {
      const savedDocument = withName(currentDocument, saveName)
      const created = await createArmy(savedDocument)
      onSaved(savedDocument, created.id)
      closeModal()
    } catch {
      // The collection context exposes the service error beside the controls.
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <GenericModal closeModal={closeModal} isOpen={isOpen} isProcessing={isSaving} label="Save Army">
      <div className={`aos4-account-modal ${theme.text}`}>
        <div className="d-flex align-items-start justify-content-between mb-3">
          <div>
            <h2 className="h4 mb-1">Save Army</h2>
            <p className="small mb-0">Save this army to your cloud armies.</p>
          </div>
          <button aria-label="Close save army" className={theme.modalDangerClass} onClick={closeModal}>
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
          <button
            className={theme.modalSuccessClass}
            disabled={!configured || !saveName.trim() || isSaving}
            onClick={() => void saveNew()}
            type="button"
          >
            Save
          </button>
        </div>
      </div>
    </GenericModal>
  )
}

export default SaveArmyModal
