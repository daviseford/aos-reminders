import { PreferenceApi } from 'api/preferenceApi'
import GenericButton from 'components/input/generic_button'
import { useAppStatus } from 'context/useAppStatus'
import { useTheme } from 'context/useTheme'
import React, { useState } from 'react'
import { IImportedArmy, TXT_FILE, WARHAMMER_APP } from 'types/import'
import { logEvent } from 'utils/analytics'
import { isValidFactionName } from 'utils/armyUtils'
import { hasErrorOrWarning } from 'utils/import/warnings'
import { getWarhammerAppArmy } from 'utils/warhammer_app/getWarhammerAppArmy'
import { warhammerAppPlaceholders } from 'utils/warhammer_app/warhammerAppUtils'

interface IImportTextAreaProps {
  handleDrop: (army: IImportedArmy) => void
}

export const ImportTextarea: React.FC<IImportTextAreaProps> = ({ handleDrop }) => {
  const { isOnline } = useAppStatus()
  const { isDark } = useTheme()
  const [text, setText] = useState('')

  const canImport =
    text &&
    (text.includes(warhammerAppPlaceholders.CREATED_BY_WARHAMMER_APP) ||
      text.startsWith('Army Name: ') ||
      text.includes('Army Type: ') ||
      text.includes('Battalion Slot Filled: ') ||
      text.includes('Battlepack: '))

  const handleImport = () => {
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
            <div className="btn-group" role="group">
              <GenericButton
                className={`btn ${isDark ? `btn-outline-light` : ``} btn-success btn-block`}
                type="button"
                onClick={handleImport}
              >
                Import
              </GenericButton>
            </div>
          </div>
        )}
        {text && !canImport && (
          <div className="col-12 text-center">
            <small className={'text-danger'}>This doesn't look like a list from the Warhammer App.</small>
          </div>
        )}
      </div>
    </>
  )
}
