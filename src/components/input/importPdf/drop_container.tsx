import React, { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSubscription } from 'context/useSubscription'
import { logClick } from 'utils/analytics'
import { GITHUB_URL, ROUTES } from 'utils/env'
import { addArmyToStore } from 'utils/loadArmy/loadArmyHelpers'
import { hasFatalError } from 'utils/import/warnings'
import { LinkNewTab } from 'components/helpers/link'
import ImportDropzone from 'components/input/importPdf/drop_zone'
import { TImportError, IImportedArmy } from 'types/import'
import { useSavedArmies } from 'context/useSavedArmies'

const ImportContainer: React.FC = () => {
  const [errors, setErrors] = useState<IImportedArmy['errors']>([])
  const { isSubscribed } = useSubscription()
  const { saveArmyToS3 } = useSavedArmies()

  const handleDrop = useCallback(
    (army: IImportedArmy) => {
      setErrors(army.errors)
      // Can't proceed if there's an error (usually an unsupported faction)
      if (hasFatalError(army.errors)) return
      addArmyToStore(army)
      saveArmyToS3(army)
    },
    [saveArmyToS3]
  )

  return (
    <>
      <div className="row my-2 d-flex justify-content-center">
        <div className={'col-12 col-lg-6 col-xl-6 border border-secondary px-0'}>
          <ImportDropzone handleDrop={handleDrop} />
        </div>
      </div>

      {!isSubscribed && <InfoAlert />}

      {errors.length > 0 && (
        <div className="row d-flex justify-content-center">
          <div className={'col-12 col-lg-6 col-xl-6'}>
            {errors.map((x, i) => (
              <ErrorAlert key={`${x.text}_${i}`} text={x.text} severity={x.severity} />
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default ImportContainer

const ErrorAlert = (props: TImportError) => {
  const { text, severity } = props
  const [isOn, setIsOn] = useState(true)

  if (!isOn) return null

  const alertType = {
    'ally-warn': 'alert-warning',
    'ambiguity-warn': 'alert-warning',
    warn: 'alert-warning',
    error: 'alert-danger',
  }[severity]

  const prefix = severity === 'error' ? `Error` : `Warning`

  const info =
    severity === 'error' || severity === 'ally-warn' || severity === 'ambiguity-warn'
      ? text
      : `We couldn't find '${text}'. It may be a typo or an ally item. Make sure to add it manually.`

  return (
    <div className="mb-2">
      <div className={`alert ${alertType} text-center fade show d-flex`} role="alert">
        <div className={`flex-grow-1`}>
          <strong>{prefix}:</strong> {info}
          <br />
          <small>
            Unexpected {prefix.toLowerCase()}? Create an issue on{' '}
            <LinkNewTab
              href={`${GITHUB_URL}/issues`}
              onClick={e => logClick(`failedImport-GithubClick`)}
              label={'Github'}
            >
              Github
            </LinkNewTab>{' '}
            and be sure to attach this file.
          </small>
        </div>
        <div className={`align-self-start ml-2`}>
          <button type="button" className="close" aria-label="Close" onClick={() => setIsOn(false)}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      </div>
    </div>
  )
}

const InfoAlert = () => (
  <div className="row mt-2 d-flex justify-content-center">
    <div className={'col-12 col-lg-6 col-xl-6'}>
      <div className={`alert alert-info text-center`} role="alert">
        <small>
          Heads up! This will eventually be a <Link to={ROUTES.SUBSCRIBE}>subscriber-only</Link> feature.
        </small>
      </div>
    </div>
  </div>
)
