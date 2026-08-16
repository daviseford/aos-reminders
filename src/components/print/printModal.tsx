import type { PrintDocumentOptions } from '../../aos4/print/document'
import { PRINT_PRESETS, type PrintPageSize } from '../../aos4/print/presets'
import type { PrintPreset } from '../../aos4/print/types'
import GenericModal from 'components/modals/generic/generic_modal'
import { useTheme } from 'context/useTheme'
import React, { useState } from 'react'
import { MdFileDownload } from 'react-icons/md'

interface PrintModalProps {
  closeModal: () => void
  defaultFileName: string
  isOpen: boolean
  onDownloadPdf: (
    presetId: PrintPreset['id'],
    pageSize: PrintPageSize,
    fileName: string,
    options: PrintDocumentOptions
  ) => Promise<void>
}

const PAGE_SIZES: { id: PrintPageSize; label: string }[] = [
  { id: 'a4', label: 'A4' },
  { id: 'letter', label: 'US Letter' },
]

/**
 * The group label is a <legend> rather than a <label>. A <label> cannot name a set of radios — the
 * previous htmlFor pointed at an id that never existed, leaving "Layout" and "Page size" orphaned.
 */
const RadioGroup = <T extends string>({
  legend,
  name,
  onChange,
  options,
  value,
}: {
  legend: string
  name: string
  onChange: (value: T) => void
  options: { id: T; label: string }[]
  value: T
}) => (
  <fieldset>
    <legend className="FieldsetLegend">
      <strong>{legend}</strong>
    </legend>
    <div className="d-flex justify-content-center">
      {options.map(option => (
        /*
          Bootstrap 5 folded .custom-control/.custom-radio into the single .form-check family; the
          bespoke-styled radio is now the only radio there is. Geometry is the same (1.5em of left
          padding, 1rem inline gap, a 1em control).
        */
        <div className="form-check form-check-inline" key={option.id}>
          <input
            checked={value === option.id}
            className="form-check-input"
            id={`${name}-${option.id}`}
            name={name}
            onChange={() => onChange(option.id)}
            type="radio"
          />
          <label className="form-check-label" htmlFor={`${name}-${option.id}`}>
            {option.label}
          </label>
        </div>
      ))}
    </div>
  </fieldset>
)

const PrintModal = ({ closeModal, defaultFileName, isOpen, onDownloadPdf }: PrintModalProps) => {
  const { theme } = useTheme()
  const [presetId, setPresetId] = useState<PrintPreset['id']>('compact')
  const [pageSize, setPageSize] = useState<PrintPageSize>('a4')
  const [fileName, setFileName] = useState(defaultFileName)
  const [includeSummary, setIncludeSummary] = useState(true)
  const [downloadError, setDownloadError] = useState<string>()
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false)

  const preset = PRINT_PRESETS.find(candidate => candidate.id === presetId) ?? PRINT_PRESETS[0]

  const handleFileNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(event.target.value)
  }

  const handleDownload = async () => {
    setDownloadError(undefined)
    setIsDownloadingPdf(true)
    try {
      await onDownloadPdf(presetId, pageSize, fileName.trim() || defaultFileName, { includeSummary })
      setIsDownloadingPdf(false)
      closeModal()
    } catch {
      setDownloadError('The PDF could not be created. Please try again.')
      setIsDownloadingPdf(false)
    }
  }

  return (
    <GenericModal
      closeModal={closeModal}
      isOpen={isOpen}
      isProcessing={isDownloadingPdf}
      label="Print options"
    >
      <div className={`row justify-content-center text-center ${theme.text}`}>
        <div className="col">
          <h5>Download Reminders</h5>
        </div>
      </div>

      <div className={`row mx-3 ${theme.text}`}>
        <div className="col">
          <RadioGroup
            legend="Layout"
            name="printLayout"
            onChange={setPresetId}
            options={PRINT_PRESETS.map(option => ({ id: option.id, label: option.label }))}
            value={presetId}
          />
          <p className="small text-center mb-3">{preset.description}</p>
        </div>
      </div>

      <div className={`row mx-3 ${theme.text}`}>
        <div className="col">
          <RadioGroup
            legend="Page size"
            name="printPageSize"
            onChange={setPageSize}
            options={PAGE_SIZES}
            value={pageSize}
          />
        </div>
      </div>

      <div className="row mx-3 mt-3">
        <div className="col">
          <label htmlFor="printFileName">
            <strong className={theme.text}>PDF file name</strong>
          </label>
          <input
            className="form-control form-control-sm"
            id="printFileName"
            onChange={handleFileNameChange}
            placeholder="Enter file name"
            value={fileName}
          />
        </div>
      </div>

      <div className={`row mx-3 mt-3 ${theme.text}`}>
        <div className="col">
          <div className="form-check">
            <input
              checked={includeSummary}
              className="form-check-input"
              id="printIncludeSummary"
              onChange={event => setIncludeSummary(event.target.checked)}
              type="checkbox"
            />
            <label className="form-check-label" htmlFor="printIncludeSummary">
              <strong>Include army summary</strong>
            </label>
            <p className="small mb-0">
              A list of the army&apos;s warscrolls and points at the end of the PDF.
            </p>
          </div>
        </div>
      </div>

      {downloadError && (
        <div className="alert alert-danger mx-3 mt-3" role="alert">
          {downloadError}
        </div>
      )}

      {/*
        Full width rather than col-sm-6. The modal is shrink-to-fit at ~427px whatever the viewport,
        so a half column is ~113px — not enough for the icon plus "Download PDF", which wrapped onto
        three lines. col-sm-6 keys off viewport width, which tells us nothing about the modal's.
      */}
      <div className="row mx-3 mt-4 pb-3">
        <div className="col-12 pb-2">
          <button className={`${theme.genericButton} d-block w-100`} onClick={closeModal} type="button">
            Cancel
          </button>
        </div>
        <div className="col-12 pb-2">
          {/*
           * Filled: Download PDF is what this modal exists to do, and Cancel sits directly above it
           * in the same column. With both outlined, the two read as equal weight.
           */}
          <button
            className={`${theme.commitButton} d-block w-100`}
            disabled={isDownloadingPdf}
            onClick={() => void handleDownload()}
            type="button"
          >
            <MdFileDownload className="me-2" />
            Download PDF
          </button>
        </div>
      </div>
    </GenericModal>
  )
}

export default PrintModal
