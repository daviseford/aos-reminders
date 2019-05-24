import React, { Fragment, useState, useEffect } from 'react'
import _ from 'lodash'
import './army_builder.css'
import { TUnits, TArtifacts, TBattalions, TCommandTraits } from 'types/army'

type TFocusType = 'unit' | 'artifact' | 'battalion' | 'trait'
type TUpdateState = (val: string, idx: number) => any
type TUseState = (state: string[], updateFn: Function) => TUpdateState

interface ISetSelectionArgs {
  units: string[]
  artifacts: string[]
  battalions: string[]
  traits: string[]
}
interface IArmyBuilderProps {
  army: {
    Artifacts: TArtifacts
    Battalions: TBattalions
    Traits: TCommandTraits
    Units: TUnits
  }
  setSelections: (x: ISetSelectionArgs) => any
}

const updateState: TUseState = (state, updateFn) => {
  return (val: string, idx: number) => {
    let newState = [...state]
    if (val) {
      newState[idx] = val
    } else {
      if (idx === 0 && newState.length < 2) {
        newState = []
      } else {
        newState.splice(idx, 1)
      }
    }
    updateFn(newState)
  }
}

export const ArmyBuilder = (props: IArmyBuilderProps) => {
  const { army, setSelections } = props
  const [artifacts, setArtifacts] = useState([] as string[])
  const [battalions, setBattalions] = useState([] as string[])
  const [traits, setTraits] = useState([] as string[])
  const [units, setUnits] = useState([] as string[])

  const useArtifacts = updateState(artifacts, setArtifacts)
  const useBattalions = updateState(battalions, setBattalions)
  const useTraits = updateState(traits, setTraits)
  const useUnits = updateState(units, setUnits)

  useEffect(() => {
    setSelections({ units, battalions, artifacts, traits })
  }, [units, battalions, artifacts, traits, setSelections])

  return (
    <div className="row d-print-none">
      <div className="card-group mx-auto">
        <Card items={army.Units} entries={units} type={'unit'} updateState={useUnits} />
        <Card items={army.Traits} entries={artifacts} type={'trait'} updateState={useTraits} />
        <Card items={army.Artifacts} entries={artifacts} type={'artifact'} updateState={useArtifacts} />
        <Card items={army.Battalions} entries={battalions} type={'battalion'} updateState={useBattalions} />
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
    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 mx-auto">
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
