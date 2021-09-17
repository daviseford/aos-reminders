import GenericButton from 'components/input/generic_button'
import React, { useState } from 'react'
import { IImportedArmy } from 'types/import'
import { getWarhammerAppArmy } from 'utils/warhammer_app/getWarhammerAppArmy'
import { cleanWarhammerAppText } from 'utils/warhammer_app/warhammerAppUtils'

const BADGE_CLASS = `badge badge-pill badge-`

interface IImportTextAreaProps {
  handleDrop: (army: IImportedArmy) => void
}

export const ImportTextarea: React.FC<IImportTextAreaProps> = ({ handleDrop }) => {
  const [text, setText] = useState('')

  return (
    <>
      <div className="row">
        <div className="col-12">
          <div className="form-group pt-2 px-2">
            <label htmlFor="ImportTextarea">
              <small>Or, copy+paste your Warhammer App list here:</small>
            </label>
            <textarea
              name="ImportTextarea"
              id="ImportTextarea"
              className={'ImportTextarea'}
              onChange={e => {
                e.preventDefault()
                console.log(e.target.value)
                setText(e.target.value)
              }}
              value={text}
            />
          </div>
        </div>
        {text && (
          <div className="col-12 pb-3 ml-3">
            <div className="btn-group" role="group">
              <GenericButton
                className={`${BADGE_CLASS}success mr-1`}
                type="button"
                onClick={() => {
                  // parse the text and then send it back as an army
                  const cleanedText = cleanWarhammerAppText(text)
                  const army = getWarhammerAppArmy(cleanedText)
                  return handleDrop(army)
                }}
              >
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
