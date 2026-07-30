import {
  resolveParsedRoster,
  type Aos4ImportDiagnostic,
  type Aos4ParsedRosterResult,
} from '../../../aos4/import'
import { AOS4_CATALOG, AOS4_DEFAULT_RULES_CONTEXT_ID } from '../../../aos4/generated'
import type { Aos4ArmyDocument } from '../../../aos4/state'
import GenericModal from 'components/modals/generic/generic_modal'
import { useTheme } from 'context/useTheme'
import { useMemo, useRef, useState } from 'react'
import {
  createRosterFileTooLargeResult,
  decodeAos4RosterFile,
  decodeAos4TextRoster,
  MAX_ROSTER_FILE_BYTES,
} from '../../../importers/aos4'
import { createAos4DocumentId } from 'utils/createAos4DocumentId'
import { sendFailedImportReport } from './failedImportReport'
import ImportPreview from './importPreview'

interface ImportArmyModalProps {
  closeModal: () => void
  createDocumentId?: () => string
  isOpen: boolean
  onApply: (document: Aos4ArmyDocument) => void
}

type ImportMode = 'paste' | 'upload'

const unexpectedFileError = (): Aos4ParsedRosterResult => ({
  diagnostics: [
    {
      code: 'unsafe-input',
      severity: 'error',
      message: 'The roster file could not be read. Choose a different roster file.',
    },
  ],
})

const ImportArmyModal = ({
  closeModal,
  createDocumentId = createAos4DocumentId,
  isOpen,
  onApply,
}: ImportArmyModalProps) => {
  const { theme } = useTheme()
  const [mode, setMode] = useState<ImportMode>('upload')
  const [text, setText] = useState('')
  const [decoded, setDecoded] = useState<Aos4ParsedRosterResult>()
  const [selectedContextId, setSelectedContextId] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [droppedFile, setDroppedFile] = useState<File>()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const filePreviewRequestRef = useRef(0)

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
  const canReport = Boolean(decoded && hasErrors && (mode === 'paste' ? text : droppedFile))

  const chooseMode = (nextMode: ImportMode) => {
    filePreviewRequestRef.current += 1
    setMode(nextMode)
    setDecoded(undefined)
    setSelectedContextId('')
    setDroppedFile(undefined)
    setIsProcessing(false)
  }

  const previewText = () => {
    filePreviewRequestRef.current += 1
    setSelectedContextId('')
    setIsProcessing(false)
    setDecoded(decodeAos4TextRoster(text))
  }

  const previewFile = async (file?: File) => {
    if (!file) return
    const requestId = filePreviewRequestRef.current + 1
    filePreviewRequestRef.current = requestId
    setSelectedContextId('')
    setDecoded(undefined)
    setDroppedFile(file)
    if (file.size > MAX_ROSTER_FILE_BYTES) {
      setIsProcessing(false)
      setDecoded(createRosterFileTooLargeResult())
      return
    }
    setIsProcessing(true)
    try {
      const result = await decodeAos4RosterFile({
        name: file.name,
        bytes: new Uint8Array(await file.arrayBuffer()),
      })
      if (filePreviewRequestRef.current === requestId) setDecoded(result)
    } catch {
      if (filePreviewRequestRef.current === requestId) setDecoded(unexpectedFileError())
    } finally {
      if (filePreviewRequestRef.current === requestId) setIsProcessing(false)
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) return
    setIsDragging(false)
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
    void previewFile(event.dataTransfer?.files?.[0])
  }

  const apply = () => {
    if (!canApply || !preview?.proposedDocument) return
    onApply(preview.proposedDocument)
  }

  const reportFailedImport = () => {
    if (!canReport) return
    if (mode === 'paste') {
      sendFailedImportReport({
        diagnostics,
        file: new Blob([text], { type: 'text/plain;charset=utf-8' }),
        fileName: 'aos-reminders-failed-import.txt',
      })
      return
    }
    if (droppedFile) {
      sendFailedImportReport({
        diagnostics,
        file: droppedFile,
        fileName: droppedFile.name,
      })
    }
  }

  return (
    <GenericModal closeModal={closeModal} isOpen={isOpen} isProcessing={isProcessing} label="Import Army">
      <div className={`aos4-import-modal ${theme.text}`}>
        <div className="d-flex align-items-start justify-content-between mb-3">
          <div>
            <h2 className="h4 mb-1">Import Army</h2>
            <p className="small mb-0">
              Import composition from the current AoS app or Listbot 4.0 text export, or a New Recruit
              .ros/.rosz file.
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

        <div aria-label="Import source" className="btn-group w-100 mb-3" role="group">
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
            Upload roster
          </button>
        </div>

        {mode === 'paste' ? (
          <>
            <label className="fw-bold" htmlFor="import-roster-text">
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
              className={`${theme.modalConfirmClass} d-block w-100 mt-3`}
              disabled={!text.trim()}
              onClick={previewText}
              type="button"
            >
              Preview import
            </button>
          </>
        ) : (
          <div
            className={`${theme.dropzone}${isDragging ? ' is-dragging' : ''}`}
            onDragEnter={handleDragOver}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <label className="fw-bold text-center" htmlFor="import-roster-file">
              Drag and drop your roster here
            </label>
            <p className="small text-center mb-2">
              AoS app or Listbot text (.txt), or New Recruit roster (.ros or .rosz). Failed .json imports can
              also be reported.
            </p>
            <button
              className={theme.genericButton}
              onClick={() => fileInputRef.current?.click()}
              type="button"
            >
              Choose a file
            </button>
            {!!droppedFile && <p className="small mt-2 mb-0">{droppedFile.name}</p>}
            <input
              accept=".txt,.ros,.rosz,.json,text/plain,application/json,application/xml,application/zip"
              className="visually-hidden"
              id="import-roster-file"
              onChange={event => void previewFile(event.target.files?.[0])}
              ref={fileInputRef}
              tabIndex={-1}
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

        {canReport && (
          <div className="mt-3">
            <p className="small mb-2">
              Help us reproduce this import error. This downloads an exact copy of the failed roster and opens
              a GitHub issue draft without the roster content or original filename. Attach the downloaded file
              before submitting. GitHub issues are public, so remove any private information first.
            </p>
            <button
              className={`${theme.genericButton} d-block w-100`}
              onClick={reportFailedImport}
              type="button"
            >
              Send to devs
            </button>
          </div>
        )}

        <div className="row mt-4">
          <div className="col-6">
            <button className={`${theme.modalDangerClass} d-block w-100`} onClick={closeModal} type="button">
              Cancel
            </button>
          </div>
          <div className="col-6">
            <button
              className={`${theme.modalSuccessClass} d-block w-100`}
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
