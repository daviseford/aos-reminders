import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { parsePdf } from 'utils/pdf/pdfUtils'
import { getWarscrollArmyFromPdf, IWarscrollArmyWithErrors } from 'utils/pdf/warscroll'
import { FaCheckCircle } from 'react-icons/fa'

interface IDropzoneProps {
  handleDrop: (army: IWarscrollArmyWithErrors) => void
}

export const MyDropzone: React.FC<IDropzoneProps> = props => {
  const { handleDrop } = props

  const [isDone, setIsDone] = useState(false)

  const handleDone = () => {
    setIsDone(true)
    setTimeout(() => setIsDone(false), 5000)
  }

  const onDrop = useCallback(
    acceptedFiles => {
      const reader = new FileReader()

      // Set reader options
      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
        const pdfText = reader.result
        const parsed = parsePdf(pdfText as string)
        const parsedArmy = getWarscrollArmyFromPdf(parsed)

        handleDrop(parsedArmy)
        handleDone()
      }

      // Read the file
      reader.readAsText(acceptedFiles[0])
    },
    [handleDrop]
  )

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'application/pdf' })

  const txt = isDone ? `All done!` : `Drag your Warscroll PDF here, or click to select `

  return (
    <div {...getRootProps({ className: 'dropzone' })}>
      <input {...getInputProps()} />
      <div className="align-items-center">
        <p className="pt-3">
          {txt} {isDone && <FaCheckCircle className="text-success ml-2" />}{' '}
        </p>
      </div>
    </div>
  )
}
