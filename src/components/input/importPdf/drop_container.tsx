import React, { useCallback, useState } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { getArmy } from 'utils/getArmy/getArmy'
import { useSubscription } from 'context/useSubscription'
import { factionNames, selections, realmscape, army } from 'ducks'
import { ImportDropzone } from './drop_zone'
import { TSupportedFaction } from 'meta/factions'
import { IArmy, TUnits } from 'types/army'
import { ISelections } from 'types/selections'
import { TAllySelectionStore } from 'types/store'
import { TImportError, IImportedArmy } from 'types/import'
import { hasFatalError } from 'utils/import/warnings'
import { logClick } from 'utils/analytics'

interface IImportContainerProps {
  setFactionName: (value: string | null) => void
  setRealmscape: (value: string | null) => void
  setRealmscapeFeature: (value: string | null) => void
  updateAllyArmies: (payload: { factionName: TSupportedFaction; Army: IArmy }[]) => void
  updateAllySelections: (payload: TAllySelectionStore) => void
  updateAllyUnits: (payload: { factionName: TSupportedFaction; units: TUnits }) => void
  updateSelections: (payload: ISelections) => void
}

const ImportContainerComponent: React.FC<IImportContainerProps> = props => {
  const {
    setFactionName,
    setRealmscape,
    setRealmscapeFeature,
    updateAllyArmies,
    updateAllySelections,
    updateSelections,
  } = props

  const [errors, setErrors] = useState<IImportedArmy['errors']>([])
  const { isSubscribed } = useSubscription()

  const handleDrop = useCallback(
    (army: IImportedArmy) => {
      setErrors(army.errors)

      // Can't proceed if there's an error (usually an unsupported faction)
      if (hasFatalError(army.errors)) return

      setFactionName(army.factionName)

      // Add Ally Game data to the store
      if (army.allyFactionNames.length) {
        const armies = army.allyFactionNames.map(factionName => {
          const Army = getArmy(factionName) as IArmy
          return { factionName, Army }
        })
        updateAllyArmies(armies)
      }

      updateSelections(army.selections)
      updateAllySelections(army.allySelections)
      setRealmscape(army.realmscape)
      setRealmscapeFeature(army.realmscape_feature)
    },
    [
      setFactionName,
      setRealmscape,
      setRealmscapeFeature,
      updateAllyArmies,
      updateAllySelections,
      updateSelections,
    ]
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

const ImportContainer = connect(
  null,
  {
    setFactionName: factionNames.actions.setFactionName,
    setRealmscape: realmscape.actions.setRealmscape,
    setRealmscapeFeature: realmscape.actions.setRealmscapeFeature,
    updateAllyArmies: army.actions.updateAllyArmies,
    updateAllySelections: selections.actions.updateAllySelections,
    updateAllyUnits: selections.actions.updateAllyUnits,
    updateSelections: selections.actions.updateSelections,
  }
)(ImportContainerComponent)

export default ImportContainer

const ErrorAlert = (props: TImportError) => {
  const { text, severity } = props
  const [isOn, setIsOn] = useState(true)

  if (!isOn) return null

  const alertType = {
    'ally-warn': 'alert-warning',
    warn: 'alert-warning',
    error: 'alert-danger',
  }[severity]

  const prefix = severity === 'error' ? `Error` : `Warning`

  const info =
    severity === 'error' || severity === 'ally-warn'
      ? text
      : `We couldn't find '${text}'. It may be a typo or an unmarked ally. Make sure to add it manually.`

  return (
    <div className="mb-2">
      <div className={`alert ${alertType} text-center fade show d-flex`} role="alert">
        <div className={`flex-grow-1`}>
          <strong>{prefix}:</strong> {info}
          <br />
          <small>
            Unexpected {prefix.toLowerCase()}? Create an issue on{' '}
            <a
              href={'https://github.com/daviseford/aos-reminders/issues'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => {
                logClick(`failedImport-GithubClick`)
              }}
            >
              Github
            </a>{' '}
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
          Heads up! This will eventually be a <Link to="/subscribe">subscriber-only</Link> feature.
        </small>
      </div>
    </div>
  </div>
)
