import { getPdfPages, handleAzyrPages } from 'utils/azyr/azyrPdf'
import { parsePdf } from 'utils/pdf/pdfUtils'
import { getWarscrollArmyFromPdf, getWarscrollArmyFromText } from 'utils/warscroll/getWarscrollArmy'
import { logEvent } from 'utils/analytics'
import { getAzyrArmyFromPdf } from 'utils/azyr/getAzyrArmy'
import { isValidFactionName } from 'utils/armyUtils'
import { hasErrorOrWarning } from 'utils/import/warnings'
import { PreferenceApi } from 'api/preferenceApi'
import { IImportedArmy, TImportParsers, TImportFileTypes } from 'types/import'

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
  return new TextDecoder('utf-8').decode(new Uint8Array(buf))
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

        if (parser === 'Unknown') {
          logEvent(`Import${parser}`)
          return stopProcessing() && handleError()
        }

        if (isWarscroll) {
          const fileTxt = isPdf ? arrayBufferToString(reader.result) : (reader.result as string)
          const { parsedFile, parsedArmy } = handleWarscroll(fileTxt, file.type)

          // Send a copy of our file to S3
          if (hasErrorOrWarning(parsedArmy.errors)) {
            const payload = { fileTxt: parsedFile, parser, fileType: file.type }
            Promise.resolve(PreferenceApi.createErrorFile(payload))
          }

          handleDrop(parsedArmy)
          stopProcessing() && handleDone()
          if (isValidFactionName(parsedArmy.factionName)) {
            logEvent(`Import${parser}-${parsedArmy.factionName}`)
          }
        } else {
          const parsedPages = handleAzyrPages(pdfPages)
          const parsedArmy: IImportedArmy = getAzyrArmyFromPdf(parsedPages)

          if (hasErrorOrWarning(parsedArmy.errors)) {
            const payload = { fileTxt: pdfPages, parser, fileType: file.type }
            Promise.resolve(PreferenceApi.createErrorFile(payload))
          }

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
  if (fileType === 'application/pdf') {
    const parsedFile = parsePdf(fileText)
    const parsedArmy = getWarscrollArmyFromPdf(parsedFile)
    return { parsedFile, parsedArmy }
  } else {
    const parsedArmy = getWarscrollArmyFromText(fileText)
    return { parsedFile: fileText, parsedArmy }
  }
}
