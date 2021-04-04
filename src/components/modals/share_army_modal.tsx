import Spinner from 'components/helpers/spinner'
import GenericButton from 'components/input/generic_button'
import GenericModal from 'components/modals/generic/generic_modal'
import { useSavedArmies } from 'context/useSavedArmies'
import { useTheme } from 'context/useTheme'
import { selectors } from 'ducks'
import React, { useEffect, useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { FaLink } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { ISavedArmy } from 'types/savedArmy'
import { logEvent } from 'utils/analytics'
import { prepareArmy } from 'utils/armyUtils'
import useGetReminders from 'utils/hooks/useGetReminders'

interface IModalComponentProps {
  modalIsOpen: boolean
  closeModal: () => void
}

export const ShareArmyModal: React.FC<IModalComponentProps> = ({ closeModal, modalIsOpen }) => {
  const { relevantNotes } = useGetReminders()
  const { saveLink } = useSavedArmies()
  const { theme, isDark } = useTheme()

  const army = useSelector(selectors.selectCurrentArmy)
  const hiddenReminders = useSelector(selectors.selectReminders)

  const [link, setLink] = useState<string | null>(null)
  const [processing, setProcessing] = useState(true)
  const [copied, setCopied] = useState(false)

  const handleLinkGeneration = async () => {
    const payload = prepareArmy({ ...army, hiddenReminders, notes: relevantNotes } as ISavedArmy, 'save')
    const url = await saveLink(payload as ISavedArmy)

    setLink(url)
    logEvent(`GeneratedLink-${army.factionName}`)
    setProcessing(false)
  }

  useEffect(() => {
    handleLinkGeneration()
    return () => setLink(null)
    // eslint-disable-next-line
  }, [])

  return (
    <GenericModal isOpen={modalIsOpen} closeModal={closeModal} label="Share Link Modal">
      <div className="row mx-2">
        <div className="col py-2">
          <h5>
            <strong className={theme.text}>{processing ? `Generating` : `Share`} Link</strong>
          </h5>

          {processing && <Spinner className={`my-3 mx-5 px-3`} variant={isDark ? `light-gray` : `dark`} />}

          {link && (
            <CopyToClipboard onCopy={() => setCopied(true)} text={link}>
              <p className={`${theme.text} mb-0`}>{link}</p>
            </CopyToClipboard>
          )}

          {copied && <small className={`${theme.textMuted} mb-0`}>Copied to clipboard!</small>}
        </div>
      </div>

      <div className="row mt-3 d-flex text-center">
        <div className="col pl-0">
          {link && (
            <CopyToClipboard onCopy={() => setCopied(true)} text={link}>
              <GenericButton className={theme.modalConfirmClass}>
                <FaLink className="mr-2" /> Copy
              </GenericButton>
            </CopyToClipboard>
          )}

          <GenericButton className={theme.modalDangerClass} onClick={closeModal}>
            Close
          </GenericButton>
        </div>
      </div>
    </GenericModal>
  )
}
