import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { parsePdf } from 'utils/pdf/pdfUtils'
import { getWarscrollArmyFromPdf, IWarscrollArmyWithErrors } from 'utils/pdf/warscroll'

interface IDropzoneProps {
  handleDrop: (army: IWarscrollArmyWithErrors) => void
}

export const MyDropzone: React.FC<IDropzoneProps> = props => {
  const { handleDrop } = props

  const onDrop = useCallback(
    acceptedFiles => {
      const reader = new FileReader()

      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
        const pdfText = reader.result
        const parsed = parsePdf(pdfText as string)
        const parsedArmy = getWarscrollArmyFromPdf(parsed)
        console.log(parsedArmy)
        handleDrop(parsedArmy)
      }

      acceptedFiles.forEach(file => reader.readAsText(file))
    },
    [handleDrop]
  )

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'application/pdf' })

  return (
    <div {...getRootProps({ className: 'dropzone' })}>
      <input {...getInputProps()} />
      <p className="pt-3">Drag your Warscroll PDF here, or click to select</p>
    </div>
  )
}
