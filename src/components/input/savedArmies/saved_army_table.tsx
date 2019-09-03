import React from 'react'
import { titleCase } from 'utils/titleCase'
import { ISavedArmyFromApi, ISavedArmy } from 'types/savedArmy'
import { sortBy, flatten } from 'lodash'

interface ISavedArmyTable {
  army: ISavedArmyFromApi | ISavedArmy
}

export const SavedArmyTable: React.FC<ISavedArmyTable> = ({ army }) => {
  const armySelectionKeys = sortBy(Object.keys(army.selections).filter(key => army.selections[key].length))
  const allyUnits = sortBy(
    flatten(
      Object.keys(army.allySelections).map(factionName => {
        return army.allySelections[factionName].units
      })
    )
  )

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
          {armySelectionKeys.map((key, i) => {
            let items = army.selections[key]
            if (key === 'units') {
              items = items.concat(allyUnits)
            }
            return <Tr items={items} title={key} key={i} />
          })}
        </tbody>
      </table>
    </>
  )
}

interface ITrProps {
  title: string
  items: string[]
}

const Tr = ({ title, items }: ITrProps) => (
  <tr>
    <td className="text-nowrap">
      <strong>{titleCase(title)}</strong>
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
