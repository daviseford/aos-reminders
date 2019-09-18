import { getPdfPages, handleAzyrPages } from 'utils/azyr/azyrPdf'
import { parsePdf } from 'utils/pdf/pdfUtils'
import { getWarscrollArmyFromPdf, getWarscrollArmyFromText } from 'utils/warscroll/getWarscrollArmy'
import { logEvent } from 'utils/analytics'
import { IImportedArmy, TImportParsers } from 'types/import'
import { getAzyrArmy } from 'utils/azyr/getAzyrArmy'

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

const checkFileInformation = async (typedarray, fileType: TImportFileTypes) => {
  let data = { isWarscroll: true, parser: 'Warscroll Builder' as TImportParsers, pdfPages: [] as string[] }

  if (fileType === 'text/plain') return data

  data.pdfPages = await getPdfPages(typedarray)
  data.isWarscroll = data.pdfPages.some(x => x.includes('Warscroll Builder'))
  data.parser = data.isWarscroll ? 'Warscroll Builder' : 'Azyr'
  console.log('isWarscroll', data.isWarscroll)

  return data
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
        //Step 4:turn array buffer into typed array
        const typedArray = new Uint8Array(reader.result as any)

        const { isWarscroll, pdfPages, parser } = await checkFileInformation(typedArray, file.type)

        setParser(parser)

        if (isWarscroll) {
          const fileText = arrayBufferToString(reader.result)
          const parsedArmy: IImportedArmy = handleWarscroll(fileText, file.type)
          handleDrop(parsedArmy)
          handleDone()
          logEvent(`Import${parser}-${parsedArmy.factionName}`)
        } else {
          const parsedPages = handleAzyrPages(pdfPages)
          const parsedArmy: IImportedArmy = getAzyrArmy(parsedPages)
          console.log(parsedArmy)
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
