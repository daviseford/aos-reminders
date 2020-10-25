import Spinner from 'components/helpers/spinner'
import { handleParseFile } from 'components/input/importPdf/parseFile'
import { useAppStatus } from 'context/useAppStatus'
import { useSavedArmies } from 'context/useSavedArmies'
import { useTheme } from 'context/useTheme'
import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FaRegCheckCircle } from 'react-icons/fa'
import { MdErrorOutline } from 'react-icons/md'
import { centerContentClass } from 'theme/helperClasses'
import {
  AZYR,
  BATTLESCRIBE,
  HTML_FILE,
  IImportedArmy,
  PDF_FILE,
  TImportParsers,
  WARSCROLL_BUILDER,
} from 'types/import'
import { resetAnalyticsStore } from 'utils/analytics'
import useWindowSize from 'utils/hooks/useWindowSize'

interface IDropzoneProps {
  handleDrop: (army: IImportedArmy) => void
}

const ImportDropzone: React.FC<IDropzoneProps> = ({ handleDrop }) => {
  const { isMobile } = useWindowSize()
  const { isOnline } = useAppStatus()
  const { setLoadedArmy } = useSavedArmies()
  const { theme } = useTheme()

  const [isDone, setIsDone] = useState(false)
  const [isError, setIsError] = useState(false)
  const [errorTxt, setErrorText] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [parser, setParser] = useState<TImportParsers>(WARSCROLL_BUILDER)

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
    resetAnalyticsStore()
    setIsDone(false)
    setIsError(false)
    setIsProcessing(true)
    return true
  }

  const stopProcessing = () => {
    setIsProcessing(false)
    return true
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onDrop = useCallback(
    handleParseFile({
      handleDrop,
      handleError,
      handleDone,
      isOnline,
      setParser,
      startProcessing,
      stopProcessing,
    }),
    [handleDrop]
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: `${PDF_FILE}, ${HTML_FILE}`,
    multiple: false,
  })

  const getText = () => {
    if (isProcessing) return ``
    if (isError) return errorTxt || `Unable to process this file`
    if (isDone) return `${parser} file processed!`
    if (isMobile) return `Tap to select your ${AZYR}/${WARSCROLL_BUILDER} PDF or ${BATTLESCRIBE} HTML`
    return `Drag your ${AZYR}/${WARSCROLL_BUILDER} PDF or ${BATTLESCRIBE} HTML here, or click to select`
  }

  return (
    <div {...getRootProps({ className: theme.dropzone })}>
      <input {...getInputProps()} />
      <div className={`${centerContentClass} text-center py-3`}>
        {isProcessing && <Spinner />}
        {getText()}
        {isDone && <FaRegCheckCircle className="text-success ml-2" />}
        {isError && <MdErrorOutline className="text-danger ml-2" />}
      </div>
    </div>
  )
}

export default ImportDropzone
