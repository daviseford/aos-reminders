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
    <div className="SelectArmy">
      <h3>Add Units:</h3>
      {_.range(0, units.length + 1).map(idx => {
        return (
          <Row items={props.army.Units} handleChange={updateState} idx={idx} val={units[idx] || ''} type={'unit'} />
        )
      })}

      <h3>Add Artifacts:</h3>
      {_.range(0, artifacts.length + 1).map(idx => {
        return (
          <Row
            items={props.army.Artifacts}
            handleChange={updateState}
            idx={idx}
            val={artifacts[idx] || ''}
            type={'artifact'}
          />
        )
      })}

      <h3>Battalions:</h3>
      {_.range(0, battalions.length + 1).map(idx => {
        return (
          <Row
            items={props.army.Battalions}
            handleChange={updateState}
            idx={idx}
            val={battalions[idx] || ''}
            type={'battalion'}
          />
        )
      })}
    </div>
  )
}

const Row = (props: ISelectProps) => {
  return (
    <div>
      <Select {...props} />
      <button
        onClick={e => {
          e.preventDefault()
          props.handleChange('', props.idx, props.type)
        }}
        disabled={!props.val}
      >
        X
      </button>
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
      <select onChange={e => props.handleChange(e.target.value, props.idx, props.type)}>
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
