import GenericButton from 'components/input/generic_button'
import { DownloadPDFModal } from 'components/print/pdfModal'
import { useSavedArmies } from 'context/useSavedArmies'
import { selectors } from 'ducks'
import jsPDF from 'jspdf'
import React, { useCallback, useState } from 'react'
import { MdFileDownload } from 'react-icons/md'
import { useSelector } from 'react-redux'
import useGetReminders from 'utils/hooks/useGetReminders'
import useWindowSize from 'utils/hooks/useWindowSize'
import { savePdf } from 'utils/pdf/generate/generatePdf'

const DownloadPDFButton = () => {
  const reminders = useGetReminders()
  const { saveArmyToS3 } = useSavedArmies()
  const { isMobile } = useWindowSize()

  const currentArmy = useSelector(selectors.selectCurrentArmy)
  const hiddenReminders = useSelector(selectors.selectReminders)

  const [pdf, setPdf] = useState<{ default: jsPDF; compact: jsPDF } | null>(null)
  const [modalIsOpen, setModalIsOpen] = useState(false)

  const handleDownload = useCallback(
    e => {
      e?.preventDefault?.()

      // Get the PDF ready to be saved
      const pdfs = savePdf({ ...currentArmy, hiddenReminders, reminders })

      setPdf(pdfs)
      saveArmyToS3(currentArmy)
      setModalIsOpen(true)
    },
    [currentArmy, hiddenReminders, reminders, saveArmyToS3]
  )

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
          closeModal={() => setModalIsOpen(false)}
        />
      )}
    </>
  )
}

export default DownloadPDFButton
