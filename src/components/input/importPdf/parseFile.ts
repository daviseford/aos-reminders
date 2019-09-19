import { getPdfPages, handleAzyrPages } from 'utils/azyr/azyrPdf'
import { parsePdf } from 'utils/pdf/pdfUtils'
import { getWarscrollArmyFromPdf, getWarscrollArmyFromText } from 'utils/warscroll/getWarscrollArmy'
import { logEvent } from 'utils/analytics'
import { IImportedArmy, TImportParsers } from 'types/import'
import { getAzyrArmyFromPdf } from 'utils/azyr/getAzyrArmy'

type TImportFileTypes = 'application/pdf' | 'text/plain'

type TUseParse = (
  handleDrop: (parsedArmy: IImportedArmy) => void,
  handleError: () => void,
  handleDone: () => void,
  setParser: (parser: TImportParsers) => void
) => (acceptedFiles: any[]) => void

const arrayBufferToString = buf => {
  //@ts-ignore
  return String.fromCharCode.apply(null, new Uint8Array(buf))
}

const checkFileInformation = async (typedArray, fileType: TImportFileTypes) => {
  let file = {
    isPdf: fileType === 'application/pdf',
    isText: fileType === 'text/plain',
    isWarscroll: true,
    parser: 'Warscroll Builder' as TImportParsers,
    pdfPages: [] as string[],
  }

  if (file.isText) return file

  file.pdfPages = await getPdfPages(typedArray)
  file.isWarscroll = file.pdfPages.some(x => x.includes('Warscroll Builder'))
  file.parser = file.isWarscroll ? 'Warscroll Builder' : 'Azyr'
  // console.log('isWarscroll', file.isWarscroll)

  return file
}

export const handleParseFile: TUseParse = (handleDrop, handleError, handleDone, setParser) => {
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
        const typedArray = new Uint8Array(reader.result as any)

        const { isPdf, isWarscroll, pdfPages, parser } = await checkFileInformation(typedArray, file.type)

        setParser(parser)

        if (isWarscroll) {
          const fileText = isPdf ? arrayBufferToString(reader.result) : reader.result
          const parsedArmy: IImportedArmy = handleWarscroll(fileText, file.type)
          handleDrop(parsedArmy)
          handleDone()
          logEvent(`Import${parser}-${parsedArmy.factionName}`)
        } else {
          const parsedPages = handleAzyrPages(pdfPages)
          const parsedArmy: IImportedArmy = getAzyrArmyFromPdf(parsedPages)
          handleDrop(parsedArmy)
          handleDone()
          logEvent(`Import${parser}-${parsedArmy.factionName}`)
        }
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

const handleWarscroll = (fileText: string, fileType: TImportFileTypes) => {
  let parsedArmy: IImportedArmy

  if (fileType === 'application/pdf') {
    const parsed = parsePdf(fileText)
    parsedArmy = getWarscrollArmyFromPdf(parsed)
  } else {
    parsedArmy = getWarscrollArmyFromText(fileText)
  }

  return parsedArmy
}
