import GenericButton from 'components/input/generic_button'
import { DownloadPDFModal } from 'components/print/pdfModal'
import { useSavedArmies } from 'context/useSavedArmies'
import { selectors } from 'ducks'
import jsPDF from 'jspdf'
import React, { useState } from 'react'
import { MdFileDownload } from 'react-icons/md'
import { connect } from 'react-redux'
import { IArmy, ICurrentArmy, TAllyArmies } from 'types/army'
import { IStore } from 'types/store'
import useWindowSize from 'utils/hooks/useWindowSize'
import { savePdf } from 'utils/pdf/generate/generatePdf'
import { processReminders } from 'utils/processReminders'

interface IDownloadPDFProps extends ICurrentArmy {
  allyArmies: TAllyArmies
  army: IArmy
  hiddenReminders: string[]
}

const DownloadPDFComponent: React.FC<IDownloadPDFProps> = props => {
  const { allyArmies, army, hiddenReminders, ...currentArmy } = props
  const { saveArmyToS3 } = useSavedArmies()
  const { isMobile } = useWindowSize()

  const [pdf, setPdf] = useState<{ default: jsPDF; compact: jsPDF } | null>(null)
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
    const pdfs = savePdf({ ...currentArmy, hiddenReminders, reminders })

    setPdf(pdfs)
    saveArmyToS3(currentArmy)
    openModal()
  }

  const text = `Download${isMobile ? `` : ` PDF`}`

  return (
    <>
      <GenericButton onClick={handleDownload}>
        <MdFileDownload className="mr-2" /> {text}
      </GenericButton>
      {modalIsOpen && pdf && (
        <DownloadPDFModal
          factionName={currentArmy.factionName}
          pdf={pdf}
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

const DownloadPDFButton = connect(mapStateToProps, null)(DownloadPDFComponent)

export default DownloadPDFButton
