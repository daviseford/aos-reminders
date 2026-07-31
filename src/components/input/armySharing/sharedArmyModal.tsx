import { ArmyApi, type SharedArmy } from '../../../api/armyApi'
import { AOS4_CATALOG } from '../../../aos4/generated'
import { createAos4ArmyDocument, type Aos4ArmyDocument } from '../../../aos4/state'
import GenericModal from 'components/modals/generic/generic_modal'
import { useTheme } from 'context/useTheme'
import { useEffect, useMemo, useState } from 'react'
import { createAos4DocumentId } from 'utils/createAos4DocumentId'

interface SharedArmyModalProps {
  closeModal: () => void
  createDocumentId?: () => string
  isOpen: boolean
  onApply: (document: Aos4ArmyDocument) => void
  shareId: string
}

const SharedArmyModal = ({
  closeModal,
  createDocumentId = createAos4DocumentId,
  isOpen,
  onApply,
  shareId,
}: SharedArmyModalProps) => {
  const { theme } = useTheme()
  const [share, setShare] = useState<SharedArmy>()
  const [error, setError] = useState<string>()
  const [isLoading, setIsLoading] = useState(true)
  const contextName = useMemo(
    () =>
      AOS4_CATALOG.rulesContexts.find(context => context.id === share?.document.rulesContextId)?.name ??
      share?.document.rulesContextId,
    [share?.document.rulesContextId]
  )

  useEffect(() => {
    let active = true
    setIsLoading(true)
    setError(undefined)
    void ArmyApi.getShare(shareId)
      .then(result => {
        if (active) setShare(result)
      })
      .catch(reason => {
        if (active) {
          setError(reason instanceof Error ? reason.message : 'The shared army could not be loaded.')
        }
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })
    return () => {
      active = false
    }
  }, [shareId])

  const apply = () => {
    if (!share) return
    onApply(
      createAos4ArmyDocument({
        ...share.document,
        id: createDocumentId(),
      })
    )
    closeModal()
  }

  return (
    <GenericModal closeModal={closeModal} isOpen={isOpen} isProcessing={isLoading} label="Shared Army">
      <div className={`aos4-account-modal ${theme.text}`}>
        <h2 className="h4">Shared Army</h2>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        {share && (
          <>
            <p className="lead mb-1">{share.document.name}</p>
            <dl>
              <dt>Rules context</dt>
              <dd>{contextName}</dd>
              <dt>Selections</dt>
              <dd>{share.document.explicitSelectionIds.length}</dd>
            </dl>
            <p className="small">
              Loading creates a new local copy. It does not change the shared army or save it to your cloud
              collection.
            </p>
          </>
        )}
        <div className="row mt-3">
          <div className="col-6">
            <button className={`${theme.modalDangerClass} d-block w-100`} onClick={closeModal} type="button">
              Keep current army
            </button>
          </div>
          <div className="col-6">
            <button
              className={`${theme.modalSuccessClass} d-block w-100`}
              disabled={!share}
              onClick={apply}
              type="button"
            >
              Load a copy
            </button>
          </div>
        </div>
      </div>
    </GenericModal>
  )
}

export default SharedArmyModal
