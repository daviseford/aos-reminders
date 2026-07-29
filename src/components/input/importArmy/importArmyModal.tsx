import {
  resolveParsedRoster,
  type Aos4ImportDiagnostic,
  type Aos4ParsedRosterResult,
} from '../../../aos4/import'
import { AOS4_CATALOG, AOS4_DEFAULT_RULES_CONTEXT_ID } from '../../../aos4/generated'
import type { Aos4ArmyDocument } from '../../../aos4/state'
import GenericModal from 'components/modals/generic/generic_modal'
import { useTheme } from 'context/useTheme'
import { useMemo, useState } from 'react'
import { decodeAos4RosterFile, decodeAos4TextRoster } from '../../../importers/aos4'
import ImportPreview from './importPreview'

interface ImportArmyModalProps {
  closeModal: () => void
  createDocumentId?: () => string
  isOpen: boolean
  onApply: (document: Aos4ArmyDocument) => void
}

type ImportMode = 'paste' | 'upload'

const createRandomDocumentId = (): string => {
  if (typeof crypto.randomUUID === 'function') return `army:${crypto.randomUUID()}`
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  return `army:${Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('')}`
}

const unexpectedFileError = (): Aos4ParsedRosterResult => ({
  diagnostics: [
    {
      code: 'unsafe-input',
      severity: 'error',
      message: 'The roster file could not be read. Choose a different .ros or .rosz file.',
    },
  ],
})

const ImportArmyModal = ({
  closeModal,
  createDocumentId = createRandomDocumentId,
  isOpen,
  onApply,
}: ImportArmyModalProps) => {
  const { theme } = useTheme()
  const [mode, setMode] = useState<ImportMode>('paste')
  const [text, setText] = useState('')
  const [decoded, setDecoded] = useState<Aos4ParsedRosterResult>()
  const [selectedContextId, setSelectedContextId] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const preview = useMemo(() => {
    if (!decoded?.parsedRoster) return undefined
    return resolveParsedRoster(
      AOS4_CATALOG,
      selectedContextId
        ? { ...decoded.parsedRoster, declaredContext: selectedContextId }
        : decoded.parsedRoster,
      {
        defaultRulesContextId: AOS4_DEFAULT_RULES_CONTEXT_ID,
        createDocumentId,
      }
    )
  }, [createDocumentId, decoded, selectedContextId])

  const diagnostics: Aos4ImportDiagnostic[] = [
    ...(decoded?.diagnostics ?? []),
    ...(preview?.diagnostics ?? []),
  ]
  const hasErrors = diagnostics.some(diagnostic => diagnostic.severity === 'error')
  const canApply = Boolean(preview?.proposedDocument) && !hasErrors

  const chooseMode = (nextMode: ImportMode) => {
    setMode(nextMode)
    setDecoded(undefined)
    setSelectedContextId('')
  }

  const previewText = () => {
    setSelectedContextId('')
    setDecoded(decodeAos4TextRoster(text))
  }

  const previewFile = async (file?: File) => {
    if (!file) return
    setIsProcessing(true)
    setSelectedContextId('')
    try {
      setDecoded(
        await decodeAos4RosterFile({
          name: file.name,
          bytes: new Uint8Array(await file.arrayBuffer()),
        })
      )
    } catch {
      setDecoded(unexpectedFileError())
    } finally {
      setIsProcessing(false)
    }
  }

  const apply = () => {
    if (!canApply || !preview?.proposedDocument) return
    onApply(preview.proposedDocument)
  }

  return (
    <GenericModal closeModal={closeModal} isOpen={isOpen} isProcessing={isProcessing} label="Import Army">
      <div className={`aos4-import-modal ${theme.text}`}>
        <div className="d-flex align-items-start justify-content-between mb-3">
          <div>
            <h2 className="h4 mb-1">Import Army</h2>
            <p className="small mb-0">
              Import composition from the current AoS app, Listbot 4.0, or a New Recruit .ros/.rosz file.
            </p>
          </div>
          <button
            aria-label="Close import"
            className={theme.modalDangerClass}
            onClick={closeModal}
            type="button"
          >
            ×
          </button>
        </div>

        <div aria-label="Import source" className="btn-group btn-block mb-3" role="group">
          <button
            aria-pressed={mode === 'paste'}
            className={mode === 'paste' ? 'btn btn-info' : theme.genericButton}
            onClick={() => chooseMode('paste')}
            type="button"
          >
            Paste roster
          </button>
          <button
            aria-pressed={mode === 'upload'}
            className={mode === 'upload' ? 'btn btn-info' : theme.genericButton}
            onClick={() => chooseMode('upload')}
            type="button"
          >
            Upload .ros/.rosz
          </button>
        </div>

        {mode === 'paste' ? (
          <>
            <label className="font-weight-bold" htmlFor="import-roster-text">
              Paste roster text
            </label>
            <textarea
              className={`form-control ${theme.bgColor} ${theme.text}`}
              id="import-roster-text"
              onChange={event => {
                setText(event.target.value)
                setDecoded(undefined)
              }}
              rows={10}
              value={text}
            />
            <button
              className={`${theme.modalConfirmClass} btn-block mt-3`}
              disabled={!text.trim()}
              onClick={previewText}
              type="button"
            >
              Preview import
            </button>
          </>
        ) : (
          <div className={theme.dropzone}>
            <label className="font-weight-bold" htmlFor="import-roster-file">
              New Recruit roster file (.ros or .rosz)
            </label>
            <input
              accept=".ros,.rosz,application/xml,application/zip"
              id="import-roster-file"
              onChange={event => void previewFile(event.target.files?.[0])}
              type="file"
            />
          </div>
        )}

        <ImportPreview
          diagnostics={diagnostics}
          onContextChange={setSelectedContextId}
          parsedRoster={decoded?.parsedRoster}
          preview={preview}
          selectedContextId={selectedContextId}
        />

        <div className="row mt-4">
          <div className="col-6">
            <button className={`${theme.modalDangerClass} btn-block`} onClick={closeModal} type="button">
              Cancel
            </button>
          </div>
          <div className="col-6">
            <button
              className={`${theme.modalSuccessClass} btn-block`}
              disabled={!canApply}
              onClick={apply}
              type="button"
            >
              Import Army
            </button>
          </div>
        </div>
      </div>
    </GenericModal>
  )
}

export default ImportArmyModal
