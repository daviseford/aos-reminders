import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FaRegCheckCircle } from 'react-icons/fa'
import { MdErrorOutline } from 'react-icons/md'
import { IImportedArmy } from 'types/warscrollTypes'
import { TParsers } from './drop_container'
import { handleParseWarscroll, handleParseAzyr } from './parseFile'
import { btnContentWrapper } from 'theme/helperClasses'

interface IDropzoneProps {
  parser: TParsers
  handleDrop: (army: IImportedArmy) => void
}

export const ImportDropzone: React.FC<IDropzoneProps> = props => {
  const { handleDrop, parser } = props

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

  const parseFile = parser === 'Warscroll' ? handleParseWarscroll : handleParseAzyr

  const onDrop = useCallback(parseFile(handleDrop, handleError, handleDone), [handleDrop])

  const accept = parser === 'Warscroll' ? 'application/pdf, text/plain' : 'application/pdf'

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept,
    multiple: false,
  })

  const txt = isError
    ? `Unable to process this file`
    : isDone
    ? `File processed`
    : `Drag your ${parser === 'Warscroll' ? 'Warscroll Builder' : 'Azyr'} file here, or click to select`

  return (
    <div {...getRootProps({ className: 'dropzone' })}>
      <input {...getInputProps()} />
      <div className={btnContentWrapper}>
        <p className="pt-3 text-center">
          {txt}
          {isDone && <FaRegCheckCircle className="text-success ml-2" />}
          {isError && <MdErrorOutline className="text-danger ml-2" />}
        </p>
      </div>
    </div>
  )
}
