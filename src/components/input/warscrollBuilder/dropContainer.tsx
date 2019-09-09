import React, { useCallback, useState } from 'react'
import { connect } from 'react-redux'
import { factionNames, selections, realmscape, army } from 'ducks'
import { TSupportedFaction } from 'meta/factions'
import { IArmy, TUnits } from 'types/army'
import { ISelections } from 'types/selections'
import { TAllySelectionStore } from 'types/store'
import { getArmy } from 'utils/getArmy'
import { MyDropzone } from './dropZone'
import { IWarscrollArmyWithErrors } from 'utils/pdf/warscroll'

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

  const [errors, setErrors] = useState<IWarscrollArmyWithErrors['errors']>([])

  const handleWarscrollDrop = useCallback(
    (army: IWarscrollArmyWithErrors) => {
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
      <div className="row my-2 d-flex justify-content-center">
        <div className={'col-12 col-lg-6 col-xl-6 border border-secondary'}>
          <MyDropzone handleDrop={handleWarscrollDrop} />
        </div>
      </div>

      {errors.length > 0 && (
        <div className="row my-2 d-flex justify-content-center">
          <div className={'col-12 col-lg-6 col-xl-6'}>
            {errors.map((x, i) => (
              <Alert key={i} text={x.text} severity={x.severity} />
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

const Alert = props => {
  const { text, severity } = props

  const alertType = {
    warn: 'alert-warning',
    error: 'alert-danger',
  }[severity]

  const prefix = severity === 'error' ? `Error` : `Warning`

  return (
    <div className="my-2">
      <div className={`alert ${alertType} text-center`} role="alert">
        {prefix}: {text}
      </div>
    </div>
  )
}
