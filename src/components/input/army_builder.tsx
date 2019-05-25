import React, { Fragment } from 'react'
import _ from 'lodash'
import './army_builder.css'
import { TUnits, TArtifacts, TBattalions, TCommandTraits } from 'types/army'
import { RealmscapeFeatures } from 'army/malign_sorcery/realmscape_features'
import { SelectRealmscape } from './select_realmscape'
import { ISelections } from 'types/selections'

type TFocusType = 'unit' | 'artifact' | 'battalion' | 'trait'
type TUpdateState = (val: string, idx: number) => any
type TUseState = (state: ISelections, key: string, updateFn: Function) => TUpdateState

interface IArmyBuilderProps {
  army: {
    Artifacts: TArtifacts
    Battalions: TBattalions
    Traits: TCommandTraits
    Units: TUnits
  }
  realmscape: string
  setSelections: (x: ISelections) => any
  setRealmscape: (val: string) => any
  selections: ISelections
}

const updateState: TUseState = (state, key, updateFn) => {
  return (val: string, idx: number) => {
    const newState = { ...state }
    let newSubState = [...newState[key]]
    if (val) {
      newSubState[idx] = val
    } else {
      if (idx === 0 && newSubState.length < 2) {
        newSubState = []
      } else {
        newSubState.splice(idx, 1)
      }
    }
    newState[key] = newSubState
    updateFn(newState)
  }
}

export const ArmyBuilder = (props: IArmyBuilderProps) => {
  const { army, setSelections, selections, setRealmscape, realmscape } = props
  const { units, traits, artifacts, battalions } = selections
  const useArtifacts = updateState(selections, 'artifacts', setSelections)
  const useBattalions = updateState(selections, 'battalions', setSelections)
  const useTraits = updateState(selections, 'traits', setSelections)
  const useUnits = updateState(selections, 'units', setSelections)

  return (
    <div className="container">
      <div className="row d-print-none">
        <div className="card-group mx-auto">
          <Card items={_.sortBy(army.Units, 'name')} entries={units} type={'unit'} updateState={useUnits} />
          <Card items={army.Traits} entries={traits} type={'trait'} updateState={useTraits} />
          <Card items={army.Artifacts} entries={artifacts} type={'artifact'} updateState={useArtifacts} />
          <Card
            items={_.sortBy(army.Battalions, 'name')}
            entries={battalions}
            type={'battalion'}
            updateState={useBattalions}
          />
          <SelectRealmscape setValue={setRealmscape} value={realmscape} items={RealmscapeFeatures.map(x => x.name)} />
        </div>
      </div>
    </div>
  )
}

interface ICardProps {
  entries: string[]
  type: TFocusType
  items: TUnits | TBattalions | TArtifacts
  updateState: TUpdateState
}

const Card = (props: ICardProps) => {
  return (
    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 mx-auto mt-3">
      <div className="card">
        <div className="card-body">
          <h4 className="text-center">Add {_.capitalize(props.type)}s</h4>
          {_.range(0, props.entries.length + 1).map(idx => {
            return (
              <Row
                items={props.items}
                handleChange={props.updateState}
                idx={idx}
                val={props.entries[idx] || ''}
                type={props.type}
                key={`row-${props.type}-${idx}`}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

const Row = (props: ISelectProps) => {
  const selectClassName = !props.val ? 'col' : 'col-10'
  const btnClassName = !props.val ? 'd-none' : 'col-2'
  return (
    <div className="row SelectArmy-Row">
      <div className={selectClassName}>
        <Select {...props} />
      </div>
      <div className={btnClassName}>
        <button
          className="btn btn-danger"
          onClick={e => {
            e.preventDefault()
            props.handleChange('', props.idx)
          }}
        >
          X
        </button>
      </div>
    </div>
  )
}

interface ISelectProps {
  items: TUnits
  handleChange: TUpdateState
  idx: number
  val: string
  type: TFocusType
}

const Select = (props: ISelectProps) => {
  return (
    <Fragment>
      <select value={props.val} className="custom-select" onChange={e => props.handleChange(e.target.value, props.idx)}>
        {props.val ? (
          <option value={props.val} key={`${props.idx}-${props.type}`}>
            {props.val}
          </option>
        ) : (
          <option value={''} key={`none-${props.type}`}>{`-- Select ${props.type} --`}</option>
        )}
        {Object.keys(props.items).map((k, i) => {
          if (props.val === k) return null // Prevent showing duplicate
          return (
            <option value={props.items[k].name} key={i}>
              {props.items[k].name}
            </option>
          )
        })}
      </select>
    </Fragment>
  )
}
