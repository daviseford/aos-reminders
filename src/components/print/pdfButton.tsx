import React, { useState } from 'react'
import { connect } from 'react-redux'
import jsPDF from 'jspdf'
import { selectors } from 'ducks'
import { MdFileDownload } from 'react-icons/md'
import { btnDarkBlock, btnContentWrapper } from 'theme/helperClasses'
import { processReminders } from 'utils/processReminders'
import { savePdf } from 'utils/pdf/generate/generatePdf'
import { componentWithSize } from 'utils/mapSizesToProps'
import { logDownloadEvent } from 'utils/analytics'
import { DownloadPDFModal } from './pdfModal'
import { TAllyArmies, IArmy, ICurrentArmy } from 'types/army'
import { IStore } from 'types/store'

interface IDownloadPDFProps extends ICurrentArmy {
  allyArmies: TAllyArmies
  army: IArmy
  hiddenReminders: string[]
  isMobile: boolean
}

const DownloadPDFComponent: React.FC<IDownloadPDFProps> = props => {
  const {
    allyArmies,
    allyFactionNames,
    allySelections,
    army,
    factionName,
    hiddenReminders,
    isMobile,
    realmscape,
    realmscape_feature,
    selections,
  } = props

  const [pdf, setPdf] = useState<jsPDF | null>(null)
  const [modalIsOpen, setModalIsOpen] = useState(false)

  const openModal = () => setModalIsOpen(true)
  const closeModal = () => setModalIsOpen(false)

  const handleDownload = e => {
    e.preventDefault()

    logDownloadEvent(factionName)

    // Generate reminders
    const reminders = processReminders(
      army,
      factionName,
      selections,
      realmscape_feature,
      allyFactionNames,
      allyArmies,
      allySelections
    )

    // Get the PDF ready to be saved
    const doc = savePdf({
      allyFactionNames,
      allySelections,
      factionName,
      hiddenReminders,
      realmscape,
      realmscape_feature,
      reminders,
      selections,
    })

    setPdf(doc)
    openModal()
  }

  const text = `Download${isMobile ? `` : ` PDF`}`

  return (
    <>
      <button className={btnDarkBlock} onClick={handleDownload}>
        <div className={btnContentWrapper}>
          <MdFileDownload className="mr-2" /> {text}
        </div>
      </button>
      <DownloadPDFModal
        factionName={factionName}
        pdf={pdf as jsPDF}
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
      />
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

const DownloadPDFButton = connect(
  mapStateToProps,
  null
)(componentWithSize(DownloadPDFComponent))

export default DownloadPDFButton
