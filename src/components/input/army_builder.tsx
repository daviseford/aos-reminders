import React from 'react'
import { sortBy, capitalize } from 'lodash'
import './army_builder.css'
import { TUnits, TArtifacts, TBattalions, TCommandTraits } from 'types/army'
import { RealmscapeFeatures } from 'army/malign_sorcery'
import { SelectRealmscape } from './select_realmscape'
import { ISelections } from 'types/selections'
import { TSelectOneSetValueFn, TDropdownOption, SelectMulti } from './select_one'
import { ValueType } from 'react-select/lib/types'

type TFocusType = 'unit' | 'artifact' | 'battalion' | 'trait'
type TFocusTypes = 'units' | 'artifacts' | 'battalions' | 'traits'
type TUpdateFn = (newState: ISelections) => void
type TUpdateState = (selectValues: ValueType<TDropdownOption>[]) => void
type TUseState = (state: ISelections, key: TFocusTypes, updateFn: TUpdateFn) => TUpdateState

interface IArmyBuilderProps {
  army: {
    Artifacts: TArtifacts
    Battalions: TBattalions
    Traits: TCommandTraits
    Units: TUnits
  }
  realmscape: string
  setSelections: (x: ISelections) => any
  setRealmscape: TSelectOneSetValueFn
  selections: ISelections
}

const updateState: TUseState = (state, key, setSelections) => {
  return (selectValues: ValueType<TDropdownOption>[]) => {
    const newState = { ...state }
    newState[key] = selectValues ? (selectValues as TDropdownOption[]).map(x => x.value) : []
    setSelections(newState)
  }
}

export const ArmyBuilder = (props: IArmyBuilderProps) => {
  const { army, setSelections, selections, setRealmscape, realmscape } = props
  const useArtifacts = updateState(selections, 'artifacts', setSelections)
  const useBattalions = updateState(selections, 'battalions', setSelections)
  const useTraits = updateState(selections, 'traits', setSelections)
  const useUnits = updateState(selections, 'units', setSelections)

  return (
    <div className="container">
      <div className="row d-print-none">
        <div className="card-group mx-auto">
          <Card items={sortBy(army.Units, 'name')} type={'unit'} setValues={useUnits} />
          <Card items={army.Traits} type={'trait'} setValues={useTraits} />
          <Card items={army.Artifacts} type={'artifact'} setValues={useArtifacts} />
          <Card items={sortBy(army.Battalions, 'name')} type={'battalion'} setValues={useBattalions} />
          <SelectRealmscape setValue={setRealmscape} value={realmscape} items={RealmscapeFeatures.map(x => x.name)} />
        </div>
      </div>
    </div>
  )
}

interface ICardProps {
  type: TFocusType
  items: TUnits | TBattalions | TArtifacts
  setValues: TUpdateState
}

const Card = (props: ICardProps) => {
  const { items, type, setValues } = props
  const selectItems = items.map(x => x.name)
  return (
    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 mx-auto mt-3">
      <div className="card">
        <div className="card-body">
          <h4 className="text-center">Add {capitalize(type)}s</h4>
          <SelectMulti items={selectItems} setValues={setValues} isClearable={true} />
        </div>
      </div>
    </div>
  )
}
