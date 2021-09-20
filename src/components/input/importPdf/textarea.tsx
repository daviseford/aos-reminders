import { PreferenceApi } from 'api/preferenceApi'
import GenericButton from 'components/input/generic_button'
import { useAppStatus } from 'context/useAppStatus'
import React, { useState } from 'react'
import { IImportedArmy, TXT_FILE, WARHAMMER_APP } from 'types/import'
import { logEvent } from 'utils/analytics'
import { isValidFactionName } from 'utils/armyUtils'
import { hasErrorOrWarning } from 'utils/import/warnings'
import { getWarhammerAppArmy } from 'utils/warhammer_app/getWarhammerAppArmy'
import { cleanWarhammerAppText } from 'utils/warhammer_app/warhammerAppUtils'

const BADGE_CLASS = `badge badge-pill badge-`

interface IImportTextAreaProps {
  handleDrop: (army: IImportedArmy) => void
}

export const ImportTextarea: React.FC<IImportTextAreaProps> = ({ handleDrop }) => {
  const { isOnline } = useAppStatus()
  const [text, setText] = useState('')

  const handleImport = () => {
    // parse the text and then send it back as an army
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
              className={'ImportTextarea'}
              placeholder={'Or paste your Warhammer App list here'}
              onChange={e => {
                e.preventDefault()
                setText(e.target.value)
              }}
              value={text}
            />
          </div>
        </div>
        {text && (
          <div className="col-12 pb-3 ml-3">
            <div className="btn-group" role="group">
              <GenericButton className={`${BADGE_CLASS}success mr-1`} type="button" onClick={handleImport}>
                Import
              </GenericButton>

              <GenericButton className={`${BADGE_CLASS}danger mr-1`} onClick={() => setText('')}>
                Clear
              </GenericButton>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
