import React, { useState, useEffect } from 'react'
import Modal from 'react-modal'
import jsPDF from 'jspdf'
import { MdFileDownload } from 'react-icons/md'
import { logDownloadEvent } from 'utils/analytics'
import { titleCase } from 'utils/textUtils'
import { TSupportedFaction } from 'meta/factions'
import { ModalStyle } from 'theme/modalStyle'
import { useSavedArmies } from 'context/useSavedArmies'
import Spinner from 'components/helpers/spinner'
import { modalConfirmClass, modalDenyClass } from 'theme/helperClasses'

interface IModalComponentProps {
  modalIsOpen: boolean
  closeModal: () => void
  factionName: TSupportedFaction
  pdf: jsPDF
}

Modal.setAppElement('#root')

const getDefaultName = (factionName: string) => {
  return `${titleCase(factionName)
    .split(' ')
    .join('_')}_Reminders`
}

export const DownloadPDFModal: React.FC<IModalComponentProps> = props => {
  const { closeModal, modalIsOpen, factionName, pdf } = props
  const { loadedArmy } = useSavedArmies()
  const defaultName = getDefaultName(loadedArmy ? loadedArmy.armyName : factionName)
  const [fileName, setFileName] = useState(defaultName)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    setFileName(getDefaultName(defaultName))
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
    setProcessing(false)
    logDownloadEvent(factionName)
    closeModal()
    setFileName('')
  }

  return (
    <Modal style={ModalStyle} isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Save Army Modal">
      <div className={`container mr-3 pl-0`}>
        {processing && <Spinner />}
        <div className="row" hidden={processing}>
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

        <div className="row" hidden={processing}>
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
      </div>
    </Modal>
  )
}
