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

  // eslint-disable-next-line
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'application/pdf' })

  const colClass = `col-12 col-lg-6 col-xl-6 border border-secondary`

  return (
    <div className="row my-2 d-flex justify-content-center">
      <div className={colClass}>
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <p>Drag your Warscroll PDF here, or click to select</p>
        </div>
      </div>
    </div>
  )
}
