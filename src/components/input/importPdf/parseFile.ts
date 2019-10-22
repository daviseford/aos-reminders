import { getPdfPages, handleAzyrPages } from 'utils/azyr/azyrPdf'
import { parsePdf } from 'utils/pdf/pdfUtils'
import { getWarscrollArmyFromPdf } from 'utils/warscroll/getWarscrollArmy'
import { logEvent } from 'utils/analytics'
import { getAzyrArmyFromPdf } from 'utils/azyr/getAzyrArmy'
import { isValidFactionName } from 'utils/armyUtils'
import { hasErrorOrWarning } from 'utils/import/warnings'
import { PreferenceApi } from 'api/preferenceApi'
import { IImportedArmy, TImportParsers } from 'types/import'
import { getBattlescribeArmy } from 'utils/battlescribe/getBattlescribeArmy'

interface IUseParseArgs {
  handleDone: () => void
  handleDrop: (parsedArmy: IImportedArmy) => void
  handleError: (error?: string) => void
  isOnline: boolean
  setParser: (parser: TImportParsers) => void
  startProcessing: () => boolean
  stopProcessing: () => boolean
}

type TUseParse = (args: IUseParseArgs) => (acceptedFiles: any[]) => void

const arrayBufferToString = buf => {
  return new TextDecoder('utf-8').decode(new Uint8Array(buf))
}

const checkFileInformation = async typedArray => {
  const { pdfPages, parser } = await getPdfPages(typedArray)
  return { pdfPages, parser }
}

export const handleParseFile: TUseParse = ({
  handleDrop,
  handleError,
  handleDone,
  isOnline,
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

        if (file.type === 'text/html') {
          const parsedArmy = getBattlescribeArmy(reader.result as string)
          handleDrop(parsedArmy)
          stopProcessing() && handleDone()
          if (isOnline && isValidFactionName(parsedArmy.factionName)) {
            logEvent(`ImportBattlescribe-${parsedArmy.factionName}`)
          }

          return
        }

        const { pdfPages, parser } = await checkFileInformation(typedArray)

        setParser(parser)

        if (pdfPages[0].startsWith('HEADER 1 aosreminders.com')) {
          logEvent(`ImportAoSReminders`)
          return stopProcessing() && handleError(`Unable to process AoS Reminder PDFs`)
        }

        if (parser === 'Battlescribe' && file.type === 'application/pdf') {
          logEvent(`Import${parser}`)
          return stopProcessing() && handleError(`We don't support Battlescribe PDFs... yet!`)
        }

        if (parser === 'Unknown') {
          logEvent(`Import${parser}`)
          return stopProcessing() && handleError()
        }

        if (parser === 'Warscroll Builder') {
          const fileTxt = arrayBufferToString(reader.result)
          const { parsedFile, parsedArmy } = handleWarscroll(fileTxt)

          // Send a copy of our file to S3
          if (isOnline && hasErrorOrWarning(parsedArmy.errors)) {
            const payload = { fileTxt: parsedFile, parser, fileType: file.type }
            Promise.resolve(PreferenceApi.createErrorFile(payload))
          }

          handleDrop(parsedArmy)
          stopProcessing() && handleDone()
          if (isOnline && isValidFactionName(parsedArmy.factionName)) {
            logEvent(`Import${parser}-${parsedArmy.factionName}`)
          }
        } else {
          const parsedPages = handleAzyrPages(pdfPages)
          const parsedArmy: IImportedArmy = getAzyrArmyFromPdf(parsedPages)

          if (isOnline && hasErrorOrWarning(parsedArmy.errors)) {
            const payload = { fileTxt: pdfPages, parser, fileType: file.type }
            Promise.resolve(PreferenceApi.createErrorFile(payload))
          }

          handleDrop(parsedArmy)
          stopProcessing() && handleDone()
          if (isOnline && isValidFactionName(parsedArmy.factionName)) {
            logEvent(`Import${parser}-${parsedArmy.factionName}`)
          }
        }
      }

      startProcessing() // Start processing spinner

      // Read the file
      if (file && file.type === 'application/pdf') {
        reader.readAsArrayBuffer(file)
      } else if (file && file.type === 'text/html') {
        reader.readAsText(file)
      } else {
        const fileType = file ? file.type : 'Unknown'
        if (isOnline) logEvent(`Import${fileType}`)
        console.error(`Error: File type not supported - ${fileType}`)
        return stopProcessing() && handleError(`Only feed me PDF files, please`)
      }
    } catch (err) {
      console.error(err)
      return stopProcessing() && handleError()
    }
  }
}

const handleWarscroll = (fileText: string) => {
  const parsedFile = parsePdf(fileText)
  const parsedArmy = getWarscrollArmyFromPdf(parsedFile)
  return { parsedFile, parsedArmy }
}
