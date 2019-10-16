import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FaRegCheckCircle } from 'react-icons/fa'
import { MdErrorOutline } from 'react-icons/md'
import { btnContentWrapper } from 'theme/helperClasses'
import Spinner from 'components/helpers/spinner'
import { handleParseFile } from './parseFile'
import { IImportedArmy, TImportParsers } from 'types/import'
import { useSavedArmies } from 'context/useSavedArmies'

interface IDropzoneProps {
  handleDrop: (army: IImportedArmy) => void
}

export const ImportDropzone: React.FC<IDropzoneProps> = props => {
  const { handleDrop } = props
  const { setLoadedArmy } = useSavedArmies()

  const [isDone, setIsDone] = useState(false)
  const [isError, setIsError] = useState(false)
  const [errorTxt, setErrorText] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [parser, setParser] = useState<TImportParsers>('Warscroll Builder')

  const handleDone = () => {
    setIsDone(true)
    setTimeout(() => setIsDone(false), 6000)
  }

  const handleError = (error?: string) => {
    if (error) setErrorText(error)
    setIsError(true)
    setTimeout(() => {
      setIsError(false)
      setErrorText(null)
    }, 6000)
  }

  const startProcessing = () => {
    setLoadedArmy(null)
    setIsDone(false)
    setIsError(false)
    setIsProcessing(true)
    return true
  }

  const stopProcessing = () => {
    setIsProcessing(false)
    return true
  }

  const onDrop = useCallback(
    handleParseFile({ handleDrop, handleError, handleDone, setParser, startProcessing, stopProcessing }),
    [handleDrop]
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'application/pdf',
    multiple: false,
  })

  const getText = () => {
    if (isProcessing) return ``
    if (isError) return errorTxt || `Unable to process this file`
    if (isDone) return `${parser} file processed!`
    return `Drag your Azyr or Warscroll Builder PDF here, or click to select`
  }

  return (
    <div {...getRootProps({ className: 'dropzone' })}>
      <input {...getInputProps()} />
      <div className={`${btnContentWrapper} py-3`}>
        {isProcessing && <Spinner />}
        {getText()}
        {isDone && <FaRegCheckCircle className="text-success ml-2" />}
        {isError && <MdErrorOutline className="text-danger ml-2" />}
      </div>
    </div>
  )
}
