import React from 'react'
import { titleCase } from 'utils/titleCase'
import { ISavedArmyFromApi, ISavedArmy } from 'types/savedArmy'
import { sortBy } from 'lodash'

interface ISavedArmyTable {
  army: ISavedArmyFromApi | ISavedArmy
}

export const SavedArmyTable: React.FC<ISavedArmyTable> = ({ army }) => {
  const selectionKeys = sortBy(Object.keys(army.selections))

  return (
    <>
      <table className="table table-sm">
        <thead>
          <tr>
            <th scope="col">Type</th>
            <th scope="col">Name</th>
          </tr>
        </thead>
        <tbody>
          {selectionKeys.map((key, i) => {
            const items = army.selections[key]
            if (!items.length) return null

            return (
              <tr key={i}>
                <td className="text-nowrap">
                  <strong>{titleCase(key)}</strong>
                </td>
                <td>
                  {items.map((item, ii) => {
                    return (
                      <span key={ii} className={`badge badge-secondary mx-1`}>
                        {item}
                      </span>
                    )
                  })}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
}
