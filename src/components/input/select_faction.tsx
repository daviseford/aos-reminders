import React, { Fragment } from 'react'

import { SUPPORTED_FACTIONS } from 'meta/factions'
import { titleCase } from 'utils/titleCase'

interface ISelectFactionsProps {
  setFactionName: (...args) => any
  factionName: string
}

export const SelectFaction = (props: ISelectFactionsProps) => {
  return (
    <div className="row w-50 mx-auto pb-3 d-block">
      <Select {...props} />
    </div>
  )
}

const Select = (props: ISelectFactionsProps) => {
  return (
    <Fragment>
      <select value={props.factionName} className="custom-select" onChange={e => props.setFactionName(e.target.value)}>
        <option value={props.factionName} key={`faction-${props.factionName}`}>
          {titleCase(props.factionName)}
        </option>
        {SUPPORTED_FACTIONS.map((name, i) => {
          if (props.factionName === name) return null // Prevent showing duplicate
          return (
            <option value={name} key={`faction-${i}`}>
              {titleCase(name)}
            </option>
          )
        })}
      </select>
    </Fragment>
  )
}
