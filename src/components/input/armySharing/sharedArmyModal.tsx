import { ArmyApi, type SharedArmy } from '../../../api/armyApi'
import { AOS4_CATALOG } from '../../../aos4/generated'
import { createAos4ArmyDocument, type Aos4ArmyDocument } from '../../../aos4/state'
import { summarizeCloudArmy } from 'components/input/cloudArmies/armySummary'
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
  const summary = useMemo(() => (share ? summarizeCloudArmy(share.document) : { unitCount: 0 }), [share])

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
            {/*
             * The same three facts the import preview shows, in the same shape, because import and
             * share are the two ways a roster built elsewhere arrives. This was "Rules context" and
             * a raw "Selections" count — `explicitSelectionIds.length`, an internal field name and a
             * number that counts factions and battle formations alongside units, so it matched
             * nothing the player could see. "Ruleset" is the word the import preview already uses.
             */}
            <dl className="row mb-2">
              <dt className="col-4">Faction</dt>
              <dd className="col-8">{summary.factionName ?? 'Not declared'}</dd>
              <dt className="col-4">Units</dt>
              <dd className="col-8">{summary.unitCount}</dd>
              <dt className="col-4">Ruleset</dt>
              <dd className="col-8">{contextName}</dd>
            </dl>
            <p className="small">
              Loading creates a new local copy. It does not change the shared army or save it to your cloud
              collection.
            </p>
          </>
        )}
        <div className="row mt-3">
          <div className="col-6">
            {/*
             * Outline, not `btn-danger`: keeping the army you already have is the reversible way out
             * of this modal, and it was the loudest control on the screen in dark theme.
             */}
            <button className={`${theme.genericButton} d-block w-100`} onClick={closeModal} type="button">
              Keep current army
            </button>
          </div>
          <div className="col-6">
            <button
              className={`${theme.commitButton} d-block w-100`}
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
