import React, { useCallback, useState } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { getArmy } from 'utils/getArmy/getArmy'
import { useSubscription } from 'context/useSubscription'
import { factionNames, selections, realmscape, army } from 'ducks'
import { WarscrollDropzone } from './warscroll_drop_zone'
import { TSupportedFaction } from 'meta/factions'
import { IArmy, TUnits } from 'types/army'
import { ISelections } from 'types/selections'
import { TAllySelectionStore } from 'types/store'
import { IWarscrollArmy, TError } from 'types/warscrollTypes'
import { FaCheck } from 'react-icons/fa'

type TParsers = 'Warscroll' | 'Azyr'

interface ILoadWarscrollArmyProps {
  setFactionName: (value: string | null) => void
  setRealmscape: (value: string | null) => void
  setRealmscapeFeature: (value: string | null) => void
  updateAllyArmy: (payload: { factionName: TSupportedFaction; Army: IArmy }) => void
  updateAllySelections: (payload: TAllySelectionStore) => void
  updateAllyUnits: (payload: { factionName: TSupportedFaction; units: TUnits }) => void
  updateSelections: (payload: ISelections) => void
}

const LoadWarscrollArmyComponent: React.FC<ILoadWarscrollArmyProps> = props => {
  const {
    setFactionName,
    setRealmscape,
    setRealmscapeFeature,
    updateAllyArmy,
    updateAllySelections,
    updateSelections,
  } = props

  const [errors, setErrors] = useState<IWarscrollArmy['errors']>([])
  const { isSubscribed } = useSubscription()
  const [parser, setParser] = useState<TParsers>('Warscroll')

  const handleWarscrollDrop = useCallback(
    (army: IWarscrollArmy) => {
      setErrors(army.errors)

      // Can't proceed if there's an error (usually an unsupported faction)
      if (army.errors.some(x => x.severity === 'error')) return

      setFactionName(army.factionName)

      // Add Ally Game data to the store
      if (army.allyFactionNames.length) {
        army.allyFactionNames.forEach(factionName => {
          const Army = getArmy(factionName) as IArmy
          updateAllyArmy({ factionName, Army })
        })
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
      updateAllyArmy,
      updateAllySelections,
      updateSelections,
    ]
  )

  return (
    <>
      <div>
        <ParserSelection activeParser={parser} setParser={setParser} />
      </div>
      <div className="row my-2 d-flex justify-content-center">
        <div className={'col-12 col-lg-6 col-xl-6 border border-secondary'}>
          <WarscrollDropzone handleDrop={handleWarscrollDrop} />
        </div>
      </div>

      {!isSubscribed && <InfoAlert />}

      {errors.length > 0 && (
        <div className="row d-flex justify-content-center">
          <div className={'col-12 col-lg-6 col-xl-6'}>
            {errors.map((x, i) => (
              <ErrorAlert key={i} text={x.text} severity={x.severity} />
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export const LoadWarscrollArmy = connect(
  null,
  {
    setFactionName: factionNames.actions.setFactionName,
    setRealmscape: realmscape.actions.setRealmscape,
    setRealmscapeFeature: realmscape.actions.setRealmscapeFeature,
    updateAllyArmy: army.actions.updateAllyArmy,
    updateAllySelections: selections.actions.updateAllySelections,
    updateAllyUnits: selections.actions.updateAllyUnits,
    updateSelections: selections.actions.updateSelections,
  }
)(LoadWarscrollArmyComponent)

const ParserSelection: React.FC<{
  activeParser: TParsers
  setParser: (parser: TParsers) => void
}> = props => {
  const { activeParser, setParser } = props
  const parsers: TParsers[] = ['Warscroll', 'Azyr']

  return (
    <>
      {parsers.map(p => (
        <button
          className={`btn btn-sm btn-${activeParser === p ? 'success' : 'secondary'}`}
          onClick={() => setParser(p)}
        >
          {activeParser === p && <FaCheck className="mr-2" />}
          {p}
        </button>
      ))}
    </>
  )
}

const ErrorAlert = (props: TError) => {
  const { text, severity } = props

  const alertType = {
    'ally-warn': 'alert-warning',
    warn: 'alert-warning',
    error: 'alert-danger',
  }[severity]

  const prefix = severity === 'error' ? `Error` : `Warning`

  const info =
    severity === 'error' || severity === 'ally-warn'
      ? text
      : `We couldn't find '${text}'. It may be a typo, an unsupported value, or an ally that was not correctly marked as "Allies". Make sure to add it manually.`
  return (
    <div className="mb-2">
      <div className={`alert ${alertType} text-center`} role="alert">
        <strong>{prefix}:</strong> {info}
        <br />
        <small>
          Unexpected {prefix.toLowerCase()}? File an issue on{' '}
          <a href={'https://github.com/daviseford/aos-reminders'} target="_blank" rel="noopener noreferrer">
            Github
          </a>{' '}
          and be sure to attach this file.
        </small>
      </div>
    </div>
  )
}

const InfoAlert = () => (
  <div className="row mt-2 d-flex justify-content-center">
    <div className={'col-12 col-lg-6 col-xl-6'}>
      <div className={`alert alert-info text-center`} role="alert">
        <small>
          Heads up! This will eventually be a <Link to="/subscribe">subscriber</Link>-only feature.
        </small>
      </div>
    </div>
  </div>
)
