import React, { Fragment, useState, useEffect } from 'react'
import _ from 'lodash'

import { IUnits, IArtifacts, IBattalions } from 'types/army'
import './select_army.css'

type TFocusType = 'unit' | 'artifact' | 'battalion'
type TUpdateState = (val: string, idx: number, type: TFocusType) => any

interface IArmyBuilderProps {
  army: {
    Artifacts: IArtifacts
    Battalions: IBattalions
    Units: IUnits
  }
  setSelections: (x: { units: string[]; artifacts: string[]; battalions: string[] }) => any
}

export const ArmyBuilder = (props: IArmyBuilderProps) => {
  const [units, setUnits] = useState([] as string[])
  const [battalions, setBattalions] = useState([] as string[])
  const [artifacts, setArtifacts] = useState([] as string[])

  const updateState: TUpdateState = (val, idx, type) => {
    const focus = {
      unit: {
        fn: setUnits,
        state: units,
      },
      artifact: {
        fn: setArtifacts,
        state: artifacts,
      },
      battalion: {
        fn: setBattalions,
        state: battalions,
      },
    }[type]

    let newState = [...focus.state]
    if (val) {
      newState[idx] = val
    } else {
      if (idx === 0 && newState.length < 2) {
        newState = []
      } else {
        newState.splice(idx, 1)
      }
    }
    focus.fn(newState)
  }

  useEffect(() => {
    props.setSelections({ units, battalions, artifacts })
  }, [units, battalions, artifacts, props])

  return (
    <div className="row d-print-none">
      <div className="card-group mx-auto">
        <Card items={props.army.Units} entries={units} type={'unit'} updateState={updateState} />
        <Card items={props.army.Artifacts} entries={artifacts} type={'artifact'} updateState={updateState} />
        <Card items={props.army.Battalions} entries={battalions} type={'battalion'} updateState={updateState} />
      </div>
    </div>
  )
}

interface ICardProps {
  entries: string[]
  type: TFocusType
  items: IUnits | IBattalions | IArtifacts
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
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

const Row = (props: ISelectProps) => {
  return (
    <div className="row SelectArmy-Row">
      <div className="col-10">
        <Select {...props} />
      </div>
      <div className="col-2">
        <button
          className="btn btn-danger"
          onClick={e => {
            e.preventDefault()
            props.handleChange('', props.idx, props.type)
          }}
          disabled={!props.val}
          hidden={!props.val}
        >
          X
        </button>
      </div>
    </div>
  )
}

interface ISelectProps {
  items: IUnits
  handleChange: TUpdateState
  idx: number
  val: string
  type: TFocusType
}

const Select = (props: ISelectProps) => {
  return (
    <Fragment>
      <select className="custom-select" onChange={e => props.handleChange(e.target.value, props.idx, props.type)}>
        {props.val ? (
          <option value={props.val} key={`${props.idx}-${props.type}`} selected>
            {props.val}
          </option>
        ) : (
          <option value={''} key={`none-${props.type}`} selected>{`-- Select ${props.type} --`}</option>
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

// const Input = (props: { updateArmyName: (name: string) => any }) => {
//   const [name, setName] = useState('')
//   return (
//     <Fragment>
//       <input value={name} onChange={e => setName(e.target.value)} placeholder="Army Name" type="text" />
//     </Fragment>
//   )
// }
