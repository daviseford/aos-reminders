import GenericTwoButtonModal from 'components/modals/generic/generic_two_button_modal'
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
  const [layout, setLayout] = useState<TSavePdfType>('compact')

  useEffect(() => {
    setFileName(defaultName)
  }, [factionName, defaultName])

  const handleUpdateName = (e: React.ChangeEvent<HTMLInputElement>) => {
    e?.preventDefault?.()
    setFileName(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      e.stopPropagation()
      handleSaveClick()
    }
  }

  const handleSaveClick = async () => {
    pdf[layout].save(`${fileName}.pdf`)
    if (isOnline) logDownloadEvent(factionName, layout)
    setFileName('')
  }

  return (
    <GenericTwoButtonModal
      closeModal={closeModal}
      confirmBtnClass={theme.modalConfirmClass}
      confirmIcon={MdFileDownload}
      confirmText={'Download'}
      denyBtnClass={theme.modalDangerClass}
      isOpen={modalIsOpen}
      onConfirmAsync={handleSaveClick}
    >
      <div className="row mx-3">
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
    </GenericTwoButtonModal>
  )
}
