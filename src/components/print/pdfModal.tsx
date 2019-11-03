import React, { useState, useEffect } from 'react'
import jsPDF from 'jspdf'
import { MdFileDownload } from 'react-icons/md'
import { useAppStatus } from 'context/useAppStatus'
import { useSavedArmies } from 'context/useSavedArmies'
import { logDownloadEvent } from 'utils/analytics'
import { titleCase, stripPunctuation } from 'utils/textUtils'
import { isValidFactionName } from 'utils/armyUtils'
import GenericModal from 'components/page/genericModal'
import { modalConfirmClass, modalDenyClass } from 'theme/helperClasses'
import { TSupportedFaction } from 'meta/factions'

interface IModalComponentProps {
  modalIsOpen: boolean
  closeModal: () => void
  factionName: TSupportedFaction
  pdf: jsPDF
}

const getDefaultName = (name: string) => {
  name = isValidFactionName(name) ? titleCase(name) : stripPunctuation(name)
  return `${name
    .trim()
    .split(' ')
    .join('_')}_Reminders`
}

export const DownloadPDFModal: React.FC<IModalComponentProps> = props => {
  const { closeModal, modalIsOpen, factionName, pdf } = props
  const { isOnline } = useAppStatus()
  const { loadedArmy } = useSavedArmies()
  const defaultName = getDefaultName(loadedArmy ? loadedArmy.armyName : factionName)
  const [fileName, setFileName] = useState(defaultName)
  const [processing, setProcessing] = useState(false)

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
    pdf.save(`${fileName}.pdf`)
    if (isOnline) logDownloadEvent(factionName)
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
                <strong>Filename</strong>
                <span className="text-muted">.pdf</span>
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

      <div className="row">
        <div className="col px-0">
          <button className={modalConfirmClass} onClick={handleSaveClick}>
            <div className="d-flex align-items-center">
              <MdFileDownload className="mr-2" /> Download
            </div>
          </button>

          <button className={modalDenyClass} onClick={closeModal}>
            <div className="d-flex align-items-center">Cancel</div>
          </button>
        </div>
      </div>
    </GenericModal>
  )
}
