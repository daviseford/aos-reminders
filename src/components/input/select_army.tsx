import React, { Fragment, useState } from 'react'
import _ from 'lodash'

import * as SeraphonArmy from '../../army/seraphon'
import { IUnits } from 'types/army'
import './select_army.css'

export const SelectArmy = props => {
  const [units, setUnits] = useState([] as string[])

  const updateState = (val: string, idx: number) => {
    let newState = [...units]
    if (val) {
      newState[idx] = val
    } else {
      if (idx === 0 && newState.length < 2) {
        newState = []
      } else {
        newState.splice(idx, 1)
      }
    }
    setUnits(newState)
  }

  return (
    <div className="SelectArmy">
      {_.range(0, units.length + 1).map(idx => {
        return <Row units={SeraphonArmy.Units} handleChange={updateState} idx={idx} val={units[idx] || ''} />
      })}

      <p>State: {units.join(', ')}</p>
    </div>
  )
}

const Row = (props: ISelect) => {
  return (
    <div>
      <Select {...props} />
      <button
        onClick={e => {
          e.preventDefault()
          props.handleChange('', props.idx)
        }}
        disabled={!props.val}
      >
        X
      </button>
    </div>
  )
}

interface ISelect {
  units: IUnits
  handleChange: (val: string, idx: number) => any
  idx: number
  val: string
}

const Select = (props: ISelect) => {
  return (
    <Fragment>
      <select onChange={e => props.handleChange(e.target.value, props.idx)}>
        {props.val ? (
          <option value={props.val}>{props.units[props.val].name}</option>
        ) : (
          <option value={''}>{'-- Select a Unit --'}</option>
        )}
        {Object.keys(props.units).map((k, i) => {
          if (props.val === k) return null // Prevent showing duplicate
          return (
            <option value={k} key={i}>
              {props.units[k].name}
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
