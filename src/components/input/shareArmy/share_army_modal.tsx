import React, { useState, useEffect } from 'react'
import { FaLink } from 'react-icons/fa'
import CopyToClipboard from 'react-copy-to-clipboard'
import { useSavedArmies } from 'context/useSavedArmies'
import { useTheme } from 'context/useTheme'
import { logEvent } from 'utils/analytics'
import { prepareArmy } from 'utils/armyUtils'
import Spinner from 'components/helpers/spinner'
import GenericModal from 'components/page/genericModal'
import GenericButton from '../generic_button'
import { ISavedArmy } from 'types/savedArmy'
import { IVisibilityStore } from 'types/store'

interface IModalComponentProps {
  modalIsOpen: boolean
  closeModal: () => void
  showSavedArmies: () => void
  army: ISavedArmy
  hiddenReminders: IVisibilityStore['reminders']
}

export const ShareArmyModal: React.FC<IModalComponentProps> = props => {
  const { closeModal, modalIsOpen, army, hiddenReminders } = props
  const { saveLink } = useSavedArmies()
  const { theme, isDark } = useTheme()
  const [link, setLink] = useState<string | null>(null)
  const [processing, setProcessing] = useState(true)
  const [copied, setCopied] = useState(false)

  const handleLinkGeneration = async () => {
    const payload = prepareArmy({ ...army, hiddenReminders }, 'save')
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
      <div className="row">
        <div className="col">
          <h5>
            <strong className={theme.text}>{processing ? `Generating` : `Share`} Link</strong>
          </h5>

          {processing && <Spinner className={`my-5 mx-5`} variant={isDark ? `light-gray` : `dark`} />}

          {link && (
            <CopyToClipboard onCopy={() => setCopied(true)} text={link}>
              <p className={`${theme.text} mb-0`}>{link}</p>
            </CopyToClipboard>
          )}

          {copied && <small className={`${theme.textMuted} mb-0`}>Copied to clipboard!</small>}
        </div>
      </div>

      <div className="row mt-3">
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
