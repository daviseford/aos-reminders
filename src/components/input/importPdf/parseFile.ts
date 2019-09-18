import { getPdfPages, handleAzyrPages } from 'utils/azyr/azyrPdf'
import { IImportedArmy } from 'types/warscrollTypes'
import { parsePdf } from 'utils/pdf/pdfUtils'
import { getWarscrollArmyFromPdf, getWarscrollArmyFromText } from 'utils/warscroll/getWarscrollArmy'
import { logEvent } from 'utils/analytics'

type TUseParse = (
  handleDrop: (parsedArmy: IImportedArmy) => void,
  handleError: () => void,
  handleDone: () => void
) => (acceptedFiles: any[]) => void

function ab2str(buf) {
  //@ts-ignore
  return String.fromCharCode.apply(null, new Uint16Array(buf))
}

const check = async typedarray => {
  const pdfPages = await getPdfPages(typedarray)

  const isWarscroll = pdfPages.some(x => x.includes('Warscroll Builder'))
  console.log('isWarscroll', isWarscroll)
}

export const handleParseAzyr: TUseParse = (handleDrop, handleError, handleDone) => {
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
        const typedarray = new Uint8Array(reader.result as any)

        const a = await check(typedarray)
        const pdfPages = await getPdfPages(typedarray)
        const parsedPages = handleAzyrPages(pdfPages)

        // handleDrop(parsedArmy)
        handleDone()
        // logEvent(`ImportAzyr-${parsedArmy.factionName}`)
      }

      // Read the file
      reader.readAsArrayBuffer(file)
    } catch (err) {
      handleError()
      console.error(err)
    }
  }
}

export const handleParseWarscroll: TUseParse = (handleDrop, handleError, handleDone) => {
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
      reader.onload = () => {
        const fileText = reader.result
        let parsedArmy: IImportedArmy

        if (file.type === 'application/pdf') {
          const parsed = parsePdf(fileText as string)
          parsedArmy = getWarscrollArmyFromPdf(parsed)
        } else {
          parsedArmy = getWarscrollArmyFromText(fileText as string)
        }

        handleDrop(parsedArmy)
        handleDone()
        logEvent(`ImportWarscroll-${parsedArmy.factionName}`)
      }

      // Read the file
      reader.readAsText(file)
    } catch (err) {
      handleError()
      console.error(err)
    }
  }
}
