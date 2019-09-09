import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { getWarscrollArmyFromPdf, parsePdf } from 'utils/pdfUtils'

interface IDropzoneProps {
  handleDrop: (army) => void
}
export const MyDropzone: React.FC<IDropzoneProps> = props => {
  const { handleDrop } = props
  const onDrop = useCallback(acceptedFiles => {
    const reader = new FileReader()

    reader.onabort = () => console.log('file reading was aborted')
    reader.onerror = () => console.log('file reading has failed')
    reader.onload = () => {
      // Do whatever you want with the file contents
      const pdfText = reader.result
      const parsed = parsePdf(pdfText as string)
      const parsedArmy = getWarscrollArmyFromPdf(parsed)
      handleDrop(parsedArmy)
      console.log(parsedArmy)
    }

    acceptedFiles.forEach(file => reader.readAsText(file))
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <p>Drag 'n' drop some files here, or click to select files</p>
    </div>
  )
}
