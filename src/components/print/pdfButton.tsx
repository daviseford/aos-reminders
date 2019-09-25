import React, { useState } from 'react'
import { connect } from 'react-redux'
import { army, selections, factionNames, visibility, realmscape } from 'ducks'
import { MdFileDownload } from 'react-icons/md'
import { btnDarkBlock, btnContentWrapper } from 'theme/helperClasses'
import { TSupportedFaction } from 'meta/factions'
import { TAllyArmies, IArmy } from 'types/army'
import { IAllySelections, ISelections } from 'types/selections'
import { IStore } from 'types/store'
import { processReminders } from 'utils/processReminders'
import { savePdf } from 'utils/pdf/generate/generatePdf'
import { componentWithSize } from 'utils/mapSizesToProps'
import { logDownloadEvent } from 'utils/analytics'
import jsPDF from 'jspdf'
import { DownloadPDFModal } from './pdfModal'

interface IDownloadPDFProps {
  allyArmies: TAllyArmies
  allyFactionNames: TSupportedFaction[]
  allySelections: { [key: string]: IAllySelections }
  army: IArmy
  factionName: TSupportedFaction
  hiddenReminders: string[]
  isMobile: boolean
  realmscape_feature: string
  selections: ISelections
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
  allyArmies: army.selectors.getAllyArmies(state),
  allyFactionNames: selections.selectors.getAllyFactionNames(state),
  allySelections: selections.selectors.getAllySelections(state),
  army: army.selectors.getArmy(state),
  factionName: factionNames.selectors.getFactionName(state),
  hiddenReminders: visibility.selectors.getReminders(state),
  realmscape_feature: realmscape.selectors.getRealmscapeFeature(state),
  selections: selections.selectors.getSelections(state),
})

const DownloadPDFButton = connect(
  mapStateToProps,
  null
)(componentWithSize(DownloadPDFComponent))

export default DownloadPDFButton
