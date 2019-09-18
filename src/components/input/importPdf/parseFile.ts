import { getPdfPages, handleAzyrPages } from 'utils/azyr/azyrPdf'
import { IImportedArmy } from 'types/warscrollTypes'
import { parsePdf } from 'utils/pdf/pdfUtils'
import { getWarscrollArmyFromPdf, getWarscrollArmyFromText } from 'utils/warscroll/getWarscrollArmy'
import { logEvent } from 'utils/analytics'
import { TParsers } from './drop_container'

type TFileTypes = 'application/pdf' | 'text/plain'

type TUseParse = (
  handleDrop: (parsedArmy: IImportedArmy) => void,
  handleError: () => void,
  handleDone: () => void
) => (acceptedFiles: any[]) => void

const arrayBufferToString = buf => {
  //@ts-ignore
  return String.fromCharCode.apply(null, new Uint8Array(buf))
}

const checkIsWarscroll = async (typedarray, fileType: TFileTypes) => {
  if (fileType === 'text/plain') return { isWarscroll: true, parser: 'Warscroll', pdfPages: [] }

  const pdfPages = await getPdfPages(typedarray)
  const isWarscroll = pdfPages.some(x => x.includes('Warscroll Builder'))
  const parser: TParsers = isWarscroll ? 'Warscroll' : 'Azyr'
  console.log('isWarscroll', isWarscroll)
  return { isWarscroll, pdfPages, parser }
}

export const handleParseFile: TUseParse = (handleDrop, handleError, handleDone) => {
  return acceptedFiles => {
    try {
      const file = acceptedFiles[0]
      const reader = new FileReader()

      // Set reader options
      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => {
        handleError()
        console.log('File reading has failed.')
      }
      reader.onload = async () => {
        let parsedArmy: IImportedArmy

        //Step 4:turn array buffer into typed array
        const typedArray = new Uint8Array(reader.result as any)

        const { isWarscroll, pdfPages, parser } = await checkIsWarscroll(typedArray, file.type)

        if (isWarscroll) {
          const fileText = arrayBufferToString(reader.result)
          const parsedArmy = handleWarscroll(fileText, file.type)
          handleDrop(parsedArmy)
        } else {
          const parsedPages = handleAzyrPages(pdfPages)

          // handleDrop(parsedArmy)
        }

        //@ts-ignore
        console.log('parsed', parsedArmy)
        // handleDrop(parsedArmy)
        handleDone()
        // logEvent(`Import${parser}-${parsedArmy.factionName}`)
      }

      // Read the file
      if (file.type === 'application/pdf') {
        reader.readAsArrayBuffer(file)
      } else {
        reader.readAsText(file)
      }
    } catch (err) {
      handleError()
      console.error(err)
    }
  }
}

const handleWarscroll = (fileText: string, fileType: TFileTypes) => {
  let parsedArmy: IImportedArmy

  if (fileType === 'application/pdf') {
    const parsed = parsePdf(fileText)
    parsedArmy = getWarscrollArmyFromPdf(parsed)
  } else {
    parsedArmy = getWarscrollArmyFromText(fileText)
  }

  return parsedArmy
}
