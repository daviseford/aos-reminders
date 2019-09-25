import React, { useState } from 'react'
import Modal from 'react-modal'
import jsPDF from 'jspdf'
import { MdFileDownload } from 'react-icons/md'
import { logDownloadEvent } from 'utils/analytics'
import { titleCase } from 'utils/textUtils'
import { TSupportedFaction } from 'meta/factions'
import { ModalStyle } from 'theme/modalStyle'

const btnClass = `btn btn-outline-dark`

interface IModalComponentProps {
  modalIsOpen: boolean
  closeModal: () => void
  factionName: TSupportedFaction
  pdf: jsPDF
}

Modal.setAppElement('#root')

export const DownloadPDFModal: React.FC<IModalComponentProps> = props => {
  const { closeModal, modalIsOpen, factionName, pdf } = props
  const [fileName, setFileName] = useState(titleCase(factionName))

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
    logDownloadEvent(`${fileName}.pdf`)
    closeModal()
    setFileName('')
  }

  return (
    <Modal style={ModalStyle} isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Save Army Modal">
      <div className={`container`}>
        <div className="row">
          <div className="col">
            <form>
              <div className="form-group">
                <label htmlFor="nameInput">
                  <strong>File Name</strong>
                </label>
                <input
                  className="form-control"
                  aria-describedby="nameHelp"
                  placeholder="Enter file name"
                  // value={titleCase(factionName)}
                  onKeyDown={handleKeyDown}
                  onChange={handleUpdateName}
                  defaultValue={titleCase(factionName)}
                />
              </div>
            </form>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <button className={btnClass} onClick={handleSaveClick}>
              <div className="d-flex align-items-center">
                <MdFileDownload className="mr-2" /> Download
              </div>
            </button>

            <button className={`btn btn-outline-danger`} onClick={closeModal}>
              <div className="d-flex align-items-center">Cancel</div>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
