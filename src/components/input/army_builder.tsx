import React from 'react'
import { sortBy } from 'lodash'
import './army_builder.css'
import { TUnits, TArtifacts, TBattalions, TCommandTraits } from 'types/army'
import { RealmscapeFeatures } from 'army/malign_sorcery'
import { SelectRealmscape } from './select_realmscape'
import { ISelections, IAllySelections } from 'types/selections'
import { TSelectOneSetValueFn, TDropdownOption, SelectMulti } from './select'
import { ValueType } from 'react-select/lib/types'

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
  const { army, setSelections, selections, setRealmscape } = props
  const { units, traits, artifacts, battalions } = selections
  const useArtifacts = updateState(selections, 'artifacts', setSelections)
  const useBattalions = updateState(selections, 'battalions', setSelections)
  const useTraits = updateState(selections, 'traits', setSelections)
  const useUnits = updateState(selections, 'units', setSelections)

  return (
    <div className="container">
      <div className="row d-print-none pb-3">
        <div className="col card-group mx-auto">
          <Card items={sortBy(army.Units, 'name')} values={units} type={'Unit'} setValues={useUnits} />
          <Card items={army.Traits} type={'Trait'} values={traits} setValues={useTraits} />
          <Card items={army.Artifacts} type={'Artifact'} values={artifacts} setValues={useArtifacts} />
          <Card
            items={sortBy(army.Battalions, 'name')}
            values={battalions}
            type={'Battalion'}
            setValues={useBattalions}
          />
          <SelectRealmscape setValue={setRealmscape} items={RealmscapeFeatures.map(x => x.name)} />
        </div>
      </div>
    </div>
  )
}

interface ICardProps {
  values: string[]
  type: string
  items: TUnits | TBattalions | TArtifacts
  setValues: TUpdateState
}

const Card = (props: ICardProps) => {
  const { items, type, setValues, values } = props
  const selectItems = items.map(x => x.name)
  return (
    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 mx-auto mt-3">
      <div className="card">
        <div className="card-body">
          <h4 className="text-center">Add {type}s</h4>
          <SelectMulti values={values} items={selectItems} setValues={setValues} isClearable={true} />
        </div>
      </div>
    </div>
  )
}

interface IAllyArmyBuilderProps {
  army: {
    Units: TUnits
  }
  setSelections: (x: IAllySelections) => any
  selections: IAllySelections
}

export const AllyArmyBuilder = (props: IAllyArmyBuilderProps) => {
  const { army, setSelections, selections } = props
  const { units } = selections

  const useUnits = (selectValues: ValueType<TDropdownOption>[]) => {
    const newState = { ...selections }
    newState['units'] = selectValues ? (selectValues as TDropdownOption[]).map(x => x.value) : []
    setSelections(newState)
  }

  return (
    <div className="container d-print-none">
      <div className="row border border-dark pb-3">
        <div className="col card-group mx-auto">
          <Card items={sortBy(army.Units, 'name')} values={units} type={'Allied Unit'} setValues={useUnits} />
        </div>
      </div>
    </div>
  )
}
