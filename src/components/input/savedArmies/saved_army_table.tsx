import React from 'react'
import { titleCase } from 'utils/textUtils'
import { ISavedArmyFromApi, ISavedArmy } from 'types/savedArmy'
import { sortBy, flatten } from 'lodash'

interface ISavedArmyTable {
  army: ISavedArmyFromApi | ISavedArmy
}

export const SavedArmyTable: React.FC<ISavedArmyTable> = ({ army }) => {
  const { selections, allySelections, realmscape, realmscape_feature } = army

  const armySelectionKeys = sortBy(Object.keys(selections).filter(key => selections[key].length))
  const allyUnits = sortBy(
    flatten(
      Object.keys(allySelections).map(factionName => {
        return allySelections[factionName].units
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
            let items = sortBy(selections[key])
            if (key === 'units') {
              items = items.concat(allyUnits)
            }
            return <Tr items={items} title={key} key={`${key}_${i}`} />
          })}

          {realmscape && <Tr items={[realmscape]} title={'Realmscape'} />}

          {realmscape_feature && <Tr items={[realmscape_feature]} title={'Realm Feature'} />}
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
          <span key={`${item}_${ii}`} className={`badge badge-secondary text-wrap mx-1`}>
            {item}
          </span>
        )
      })}
    </td>
  </tr>
)
