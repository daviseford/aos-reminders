import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FaRegCheckCircle } from 'react-icons/fa'
import { MdErrorOutline } from 'react-icons/md'
import { parsePdf } from 'utils/pdf/pdfUtils'
import { getWarscrollArmyFromPdf, getWarscrollArmyFromText } from 'utils/warscroll/getWarscrollArmy'
import { logEvent } from 'utils/analytics'
import { IWarscrollArmy } from 'types/warscrollTypes'
import { getAzyrPdfText } from './azyrPdf'

interface IDropzoneProps {
  handleDrop: (army: IWarscrollArmy) => void
}

export const AzyrDropzone: React.FC<IDropzoneProps> = props => {
  const { handleDrop } = props

  const [isDone, setIsDone] = useState(false)
  const [isError, setIsError] = useState(false)

  const handleDone = () => {
    setIsDone(true)
    setTimeout(() => setIsDone(false), 5000)
  }

  const handleError = () => {
    setIsError(true)
    setTimeout(() => setIsError(false), 5000)
  }

  // const onDrop = useCallback(
  //   acceptedFiles => {
  //     try {
  //       const file = acceptedFiles[0]
  //       const reader = new FileReader()

  //       // Set reader options
  //       reader.onabort = () => console.log('file reading was aborted')
  //       reader.onerror = () => {
  //         handleError()
  //         console.log('File reading has failed.')
  //       }
  //       reader.onload = () => {
  //         const fileText = reader.result
  //         let parsedArmy: IWarscrollArmy

  //         if (file.type === 'application/pdf') {
  //           const parsed = parsePdf(fileText as string)
  //           parsedArmy = getWarscrollArmyFromPdf(parsed)
  //         } else {
  //           parsedArmy = getWarscrollArmyFromText(fileText as string)
  //         }

  //         handleDrop(parsedArmy)
  //         handleDone()
  //         logEvent(`ImportWarscroll-${parsedArmy.factionName}`)
  //       }

  //       // Read the file
  //       reader.readAsText(file)
  //     } catch (err) {
  //       handleError()
  //       console.error(err)
  //     }
  //   },
  //   [handleDrop]
  // )

  const onDrop = useCallback(
    acceptedFiles => {
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
          //Step 4:turn array buffer into typed array
          var typedarray = new Uint8Array(reader.result as any)

          getAzyrPdfText(typedarray)
        }

        // Read the file
        reader.readAsArrayBuffer(file)
      } catch (err) {
        handleError()
        console.error(err)
      }
    },
    [handleDrop]
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'application/pdf, text/plain',
    multiple: false,
  })

  const txt = isError
    ? `Unable to process this file`
    : isDone
    ? `File processed`
    : `Drag your Azyr file here, or click to select`

  return (
    <div {...getRootProps({ className: 'dropzone' })}>
      <input {...getInputProps()} />
      <div className="d-flex align-items-center">
        <p className="pt-3">
          {txt}
          {isDone && <FaRegCheckCircle className="text-success ml-2" />}
          {isError && <MdErrorOutline className="text-danger ml-2" />}
        </p>
      </div>
    </div>
  )
}
