import { getPdfPages, handleAzyrPages } from 'utils/azyr/azyrPdf'
import { parsePdf } from 'utils/pdf/pdfUtils'
import { getWarscrollArmyFromPdf, getWarscrollArmyFromText } from 'utils/warscroll/getWarscrollArmy'
import { logEvent } from 'utils/analytics'
import { IImportedArmy, TImportParsers } from 'types/import'
import { getAzyrArmyFromPdf } from 'utils/azyr/getAzyrArmy'
import { isValidFactionName } from 'utils/armyUtils'

type TImportFileTypes = 'application/pdf' | 'text/plain'

interface IUseParseArgs {
  handleDone: () => void
  handleDrop: (parsedArmy: IImportedArmy) => void
  handleError: () => void
  setParser: (parser: TImportParsers) => void
  startProcessing: () => boolean
  stopProcessing: () => boolean
}

type TUseParse = (args: IUseParseArgs) => (acceptedFiles: any[]) => void

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

  const { pdfPages, parser } = await getPdfPages(typedArray)

  return {
    ...file,
    pdfPages,
    parser,
    isWarscroll: parser === 'Warscroll Builder',
  }
}

export const handleParseFile: TUseParse = ({
  handleDrop,
  handleError,
  handleDone,
  setParser,
  startProcessing,
  stopProcessing,
}) => {
  return acceptedFiles => {
    try {
      const file = acceptedFiles[0]
      const reader = new FileReader()

      // Set reader options
      reader.onabort = () => {
        stopProcessing() && console.log('File reading was aborted.')
      }
      reader.onerror = () => {
        stopProcessing() && handleError()
        console.log('File reading has failed.')
      }
      reader.onload = async () => {
        const typedArray = new Uint8Array(reader.result as any)

        const { isPdf, isWarscroll, pdfPages, parser } = await checkFileInformation(typedArray, file.type)

        setParser(parser)

        if (parser === 'Unknown') return stopProcessing() && handleError()

        if (isWarscroll) {
          const fileText = isPdf ? arrayBufferToString(reader.result) : reader.result
          const parsedArmy: IImportedArmy = handleWarscroll(fileText, file.type)
          handleDrop(parsedArmy)
          stopProcessing() && handleDone()
          if (isValidFactionName(parsedArmy.factionName)) {
            logEvent(`Import${parser}-${parsedArmy.factionName}`)
          }
        } else {
          const parsedPages = handleAzyrPages(pdfPages)
          const parsedArmy: IImportedArmy = getAzyrArmyFromPdf(parsedPages)
          handleDrop(parsedArmy)
          stopProcessing() && handleDone()
          if (isValidFactionName(parsedArmy.factionName)) {
            logEvent(`Import${parser}-${parsedArmy.factionName}`)
          }
        }
      }

      // Start processing spinner
      startProcessing()

      // Read the file
      if (file.type === 'application/pdf') {
        reader.readAsArrayBuffer(file)
      } else {
        reader.readAsText(file)
      }
    } catch (err) {
      stopProcessing() && handleError()
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
