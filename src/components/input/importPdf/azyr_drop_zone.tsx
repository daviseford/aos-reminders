import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FaRegCheckCircle } from 'react-icons/fa'
import { MdErrorOutline } from 'react-icons/md'
import { logEvent } from 'utils/analytics'
import { IWarscrollArmy } from 'types/warscrollTypes'
import { getPdfPages, handleAzyrPages } from 'utils/azyr/azyrPdf'

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
        reader.onload = async () => {
          //Step 4:turn array buffer into typed array
          const typedarray = new Uint8Array(reader.result as any)

          const pdfPages = await getPdfPages(typedarray)
          const parsedPages = handleAzyrPages(pdfPages)

          //         handleDrop(parsedArmy)
          handleDone()
          //         logEvent(`ImportAzyr-${parsedArmy.factionName}`)
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
