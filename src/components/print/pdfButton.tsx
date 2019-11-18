import React, { useState } from 'react'
import { connect } from 'react-redux'
import jsPDF from 'jspdf'
import { selectors } from 'ducks'
import { MdFileDownload } from 'react-icons/md'
import { processReminders } from 'utils/processReminders'
import { savePdf } from 'utils/pdf/generate/generatePdf'
import { componentWithSize } from 'utils/mapSizesToProps'
import { DownloadPDFModal } from './pdfModal'
import { TAllyArmies, IArmy, ICurrentArmy } from 'types/army'
import { IStore } from 'types/store'
import GenericButton from 'components/input/generic_button'

interface IDownloadPDFProps extends ICurrentArmy {
  allyArmies: TAllyArmies
  army: IArmy
  hiddenReminders: string[]
  isMobile: boolean
}

const DownloadPDFComponent: React.FC<IDownloadPDFProps> = props => {
  const { allyArmies, army, hiddenReminders, isMobile, ...currentArmy } = props

  const [pdf, setPdf] = useState<jsPDF | null>(null)
  const [modalIsOpen, setModalIsOpen] = useState(false)

  const openModal = () => setModalIsOpen(true)
  const closeModal = () => setModalIsOpen(false)

  const handleDownload = e => {
    e.preventDefault()

    // Generate reminders
    const reminders = processReminders(
      army,
      currentArmy.factionName,
      currentArmy.selections,
      currentArmy.realmscape_feature,
      currentArmy.allyFactionNames,
      allyArmies,
      currentArmy.allySelections
    )

    // Get the PDF ready to be saved
    const doc = savePdf({ ...currentArmy, hiddenReminders, reminders })

    setPdf(doc)
    openModal()
  }

  const text = `Download${isMobile ? `` : ` PDF`}`

  return (
    <>
      <GenericButton onClick={handleDownload}>
        <MdFileDownload className="mr-2" /> {text}
      </GenericButton>
      {modalIsOpen && (
        <DownloadPDFModal
          factionName={currentArmy.factionName}
          pdf={pdf as jsPDF}
          modalIsOpen={modalIsOpen}
          closeModal={closeModal}
        />
      )}
    </>
  )
}

const mapStateToProps = (state: IStore, ownProps) => ({
  ...ownProps,
  ...selectors.getCurrentArmy(state),
  allyArmies: selectors.getAllyArmies(state),
  army: selectors.getArmy(state),
  hiddenReminders: selectors.getReminders(state),
})

const DownloadPDFButton = connect(mapStateToProps, null)(componentWithSize(DownloadPDFComponent))

export default DownloadPDFButton
