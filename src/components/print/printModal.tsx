import type { PrintPageSize, PrintPreset } from '../../aos4/print'
import { PRINT_PRESETS } from '../../aos4/print'
import GenericModal from 'components/modals/generic/generic_modal'
import { useTheme } from 'context/useTheme'
import React, { useState } from 'react'
import { FaPrint } from 'react-icons/fa'
import { MdFileDownload } from 'react-icons/md'

interface PrintModalProps {
  closeModal: () => void
  defaultFileName: string
  isOpen: boolean
  onDownloadPdf: (presetId: PrintPreset['id'], pageSize: PrintPageSize, fileName: string) => void
  onPrintInBrowser: (presetId: PrintPreset['id'], pageSize: PrintPageSize) => void
}

const PAGE_SIZES: { id: PrintPageSize; label: string }[] = [
  { id: 'a4', label: 'A4' },
  { id: 'letter', label: 'US Letter' },
]

const RadioGroup = <T extends string>({
  name,
  onChange,
  options,
  value,
}: {
  name: string
  onChange: (value: T) => void
  options: { id: T; label: string }[]
  value: T
}) => (
  <div className="d-flex justify-content-center">
    {options.map(option => (
      <div className="custom-control custom-radio custom-control-inline" key={option.id}>
        <input
          checked={value === option.id}
          className="custom-control-input"
          id={`${name}-${option.id}`}
          name={name}
          onChange={() => onChange(option.id)}
          type="radio"
        />
        <label className="custom-control-label" htmlFor={`${name}-${option.id}`}>
          {option.label}
        </label>
      </div>
    ))}
  </div>
)

const PrintModal = ({
  closeModal,
  defaultFileName,
  isOpen,
  onDownloadPdf,
  onPrintInBrowser,
}: PrintModalProps) => {
  const { theme } = useTheme()
  const [presetId, setPresetId] = useState<PrintPreset['id']>('compact')
  const [pageSize, setPageSize] = useState<PrintPageSize>('a4')
  const [fileName, setFileName] = useState(defaultFileName)

  const preset = PRINT_PRESETS.find(candidate => candidate.id === presetId) ?? PRINT_PRESETS[0]

  const handleFileNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(event.target.value)
  }

  const handleDownload = () => {
    onDownloadPdf(presetId, pageSize, fileName.trim() || defaultFileName)
  }

  const handlePrint = () => {
    onPrintInBrowser(presetId, pageSize)
  }

  return (
    <GenericModal closeModal={closeModal} isOpen={isOpen} label="Print options">
      <div className={`row justify-content-center text-center ${theme.text}`}>
        <div className="col">
          <h5>Print Reminders</h5>
        </div>
      </div>

      <div className={`row mx-3 ${theme.text}`}>
        <div className="col">
          <label className="mb-1" htmlFor="printLayout">
            <strong>Layout</strong>
          </label>
          <RadioGroup
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
          <label className="mb-1" htmlFor="printPageSize">
            <strong>Page size</strong>
          </label>
          <RadioGroup name="printPageSize" onChange={setPageSize} options={PAGE_SIZES} value={pageSize} />
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

      <div className="row mx-3 mt-4 pb-3">
        <div className="col-12 col-sm-4 pb-2">
          <button className={`${theme.modalDangerClass} btn-block`} onClick={closeModal} type="button">
            Cancel
          </button>
        </div>
        <div className="col-12 col-sm-4 pb-2">
          <button className={`${theme.modalConfirmClass} btn-block`} onClick={handlePrint} type="button">
            <FaPrint className="mr-2" />
            Print
          </button>
        </div>
        <div className="col-12 col-sm-4 pb-2">
          <button className={`${theme.modalConfirmClass} btn-block`} onClick={handleDownload} type="button">
            <MdFileDownload className="mr-2" />
            Download PDF
          </button>
        </div>
      </div>
    </GenericModal>
  )
}

export default PrintModal
