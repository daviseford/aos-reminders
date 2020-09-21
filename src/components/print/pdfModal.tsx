import GenericButton from 'components/input/generic_button'
import GenericModal from 'components/page/genericModal'
import { useAppStatus } from 'context/useAppStatus'
import { useSavedArmies } from 'context/useSavedArmies'
import { useTheme } from 'context/useTheme'
import jsPDF from 'jspdf'
import { TSupportedFaction } from 'meta/factions'
import React, { useEffect, useState } from 'react'
import { MdFileDownload } from 'react-icons/md'
import { TSavePdfType } from 'types/pdf'
import { logDownloadEvent } from 'utils/analytics'
import { isValidFactionName } from 'utils/armyUtils'
import { stripPunctuation, titleCase } from 'utils/textUtils'

interface IModalComponentProps {
  modalIsOpen: boolean
  closeModal: () => void
  factionName: TSupportedFaction
  pdf: { default: jsPDF; compact: jsPDF }
}

const getDefaultName = (name: string) => {
  name = isValidFactionName(name) ? titleCase(name) : stripPunctuation(name)
  return `${name.trim().split(' ').join('_')}_Reminders`
}

export const DownloadPDFModal: React.FC<IModalComponentProps> = props => {
  const { closeModal, modalIsOpen, factionName, pdf } = props
  const { isOnline } = useAppStatus()
  const { loadedArmy } = useSavedArmies()
  const { theme } = useTheme()
  const defaultName = getDefaultName(loadedArmy ? loadedArmy.armyName : factionName)
  const [fileName, setFileName] = useState(defaultName)
  const [processing, setProcessing] = useState(false)
  const [layout, setLayout] = useState<TSavePdfType>('compact')

  useEffect(() => {
    setFileName(defaultName)
  }, [factionName, defaultName])

  const handleUpdateName = (e: any) => {
    e.preventDefault()
    setFileName(e.target.value)
  }

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault()
      e.stopPropagation()
      handleSaveClick(e)
    }
  }

  const handleSaveClick = e => {
    e.preventDefault()
    setProcessing(true)
    pdf[layout].save(`${fileName}.pdf`)
    if (isOnline) logDownloadEvent(factionName, layout)
    setProcessing(false)
    setFileName('')
    closeModal()
  }

  return (
    <GenericModal
      isProcessing={processing}
      isOpen={modalIsOpen}
      closeModal={closeModal}
      label="Save Army Modal"
    >
      <div className="row">
        <div className="col">
          <form>
            <div className="form-group">
              <label htmlFor="nameInput">
                <strong className={theme.text}>File Name</strong>
              </label>
              <input
                className="form-control form-control-sm"
                aria-describedby="nameHelp"
                placeholder="Enter file name"
                defaultValue={defaultName}
                onKeyDown={handleKeyDown}
                onChange={handleUpdateName}
              />
            </div>
          </form>
        </div>
      </div>

      <div className={`row ${theme.text} justify-content-center text-center`}>
        <div className="col px-0">
          <div className="custom-control custom-radio custom-control-inline">
            <input
              type="radio"
              id="defaultLayout"
              name="defaultLayout"
              className="custom-control-input"
              checked={layout === 'default'}
              onChange={() => setLayout('default')}
            />
            <label className="custom-control-label" htmlFor="defaultLayout">
              Standard
            </label>
          </div>
          <div className="custom-control custom-radio custom-control-inline">
            <input
              type="radio"
              id="compactLayout"
              name="compactLayout"
              className="custom-control-input"
              checked={layout === 'compact'}
              onChange={() => setLayout('compact')}
            />
            <label className="custom-control-label" htmlFor="compactLayout">
              Compact
            </label>
          </div>
        </div>
      </div>

      <div className={`row ${theme.text} justify-content-center text-center`}>
        <div className="col px-0 pb-3 pt-1">
          <span className={`small ${theme.text}`}>
            {layout === 'compact' ? 'Smaller font, two columns, fewer pages' : 'Larger font, more whitespace'}
          </span>
        </div>
      </div>

      <div className="row">
        <div className="col px-0">
          <GenericButton className={theme.modalConfirmClass} onClick={handleSaveClick}>
            <MdFileDownload className="mr-2" /> Download
          </GenericButton>

          <GenericButton className={theme.modalDangerClass} onClick={closeModal}>
            Cancel
          </GenericButton>
        </div>
      </div>
    </GenericModal>
  )
}
