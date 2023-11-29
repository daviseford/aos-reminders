import { PreferenceApi } from 'api/preferenceApi'
import GenericButton from 'components/input/generic_button'
import { useAppStatus } from 'context/useAppStatus'
import { useTheme } from 'context/useTheme'
import { useState } from 'react'
import { IImportedArmy, TXT_FILE, WARHAMMER_APP } from 'types/import'
import { logEvent } from 'utils/analytics'
import { isValidFactionName } from 'utils/armyUtils'
import { hasErrorOrWarning } from 'utils/import/warnings'
import { getWarhammerAppArmy } from 'utils/warhammer_app/getWarhammerAppArmy'
import { warhammerAppPlaceholders } from 'utils/warhammer_app/warhammerAppUtils'

interface IImportTextAreaProps {
  handleDrop: (army: IImportedArmy) => void
}

export const ImportTextarea = ({ handleDrop }: IImportTextAreaProps) => {
  const { isOnline } = useAppStatus()
  const { isDark } = useTheme()
  const [text, setText] = useState('')
  const [isImporting, setIsImporting] = useState(false)

  const isFromAoSListCleaner = text.includes('Made with AoS App List Cleaner')

  const canImport =
    text &&
    !isFromAoSListCleaner &&
    (text.includes(warhammerAppPlaceholders.CREATED_BY_WARHAMMER_APP) ||
      text.startsWith('Army Name: ') ||
      text.includes('Army Type: ') ||
      text.includes('Battalion Slot Filled: ') ||
      text.includes('Battlepack: '))

  const handleImport = () => {
    setIsImporting(true) // Start the spinner

    // Parse the text and then send it back as an army
    const army = getWarhammerAppArmy(text)

    if (isOnline && hasErrorOrWarning(army.errors)) {
      const payload = {
        fileTxt: text,
        parser: WARHAMMER_APP,
        fileType: TXT_FILE,
      }
      Promise.resolve(PreferenceApi.createErrorFile(payload))
    }

    if (isOnline && isValidFactionName(army.factionName)) {
      logEvent(`Import${WARHAMMER_APP}-${army.factionName}`)
    }

    setTimeout(() => setIsImporting(false), 1000) // Stop the spinner after a second

    return handleDrop(army)
  }

  return (
    <>
      <div className="row">
        <div className="col-12">
          <div className="form-group">
            <textarea
              name="ImportTextarea"
              id="ImportTextarea"
              className={`form-control ImportTextarea${isDark ? '-Dark' : ''} ${
                text && !canImport ? 'is-invalid' : ''
              }`}
              placeholder={'Or paste your Warhammer App list here'}
              onChange={e => {
                e.preventDefault()
                setText(e.target.value)
              }}
              value={text}
            />
          </div>
        </div>
        {canImport && (
          <div className="col-12 pb-3">
            <GenericButton
              className={`btn ${isDark ? `btn-outline-light` : ``} btn-success btn-block`}
              type="button"
              onClick={handleImport}
            >
              {`Import${isImporting ? 'ing' : ''} `}
              {isImporting ? (
                <span
                  className="spinner-border spinner-border-sm ml-2"
                  role="status"
                  aria-hidden="true"
                ></span>
              ) : (
                ''
              )}
            </GenericButton>
          </div>
        )}
        {text && !canImport && (
          <div className="col-12 text-center">
            <small className={'text-danger'}>
              {isFromAoSListCleaner
                ? "We don't support lists from AoS App List Cleaner, sorry."
                : "This doesn't look like a list from the Warhammer App."}
            </small>
          </div>
        )}
      </div>
    </>
  )
}
