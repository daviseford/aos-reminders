import React, { useState, useEffect } from 'react'
import Modal from 'react-modal'
import jsPDF from 'jspdf'
import { MdFileDownload } from 'react-icons/md'
import { logDownloadEvent } from 'utils/analytics'
import { titleCase } from 'utils/textUtils'
import { TSupportedFaction } from 'meta/factions'
import { ModalStyle } from 'theme/modalStyle'
import { useSavedArmies } from 'context/useSavedArmies'

const btnClass = `btn btn-outline-dark`

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
  console.log(defaultName)
  const [fileName, setFileName] = useState(defaultName)

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
    pdf.save(`${fileName}.pdf`)
    logDownloadEvent(factionName)
    closeModal()
    setFileName('')
  }

  return (
    <Modal style={ModalStyle} isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Save Army Modal">
      <div className={`container mr-3 pl-0`}>
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
            <button className={`${btnClass} ml-3 mr-5`} onClick={handleSaveClick}>
              <div className="d-flex align-items-center">
                <MdFileDownload className="mr-2" /> Download
              </div>
            </button>

            <button className={`btn btn-outline-danger ml-3`} onClick={closeModal}>
              <div className="d-flex align-items-center">Cancel</div>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
