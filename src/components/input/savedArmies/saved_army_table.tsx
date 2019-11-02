import React from 'react'
import { sortBy, flatten } from 'lodash'
import { titleCase } from 'utils/textUtils'
import { useTheme } from 'context/useTheme'
import { ISavedArmyFromApi, ISavedArmy } from 'types/savedArmy'
import { ITheme } from 'types/theme'

interface ISavedArmyTable {
  army: ISavedArmyFromApi | ISavedArmy
}

export const SavedArmyTable: React.FC<ISavedArmyTable> = ({ army }) => {
  const { selections, allySelections, realmscape, realmscape_feature } = army
  const { theme } = useTheme()

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
      <table className={`table table-sm`}>
        <tbody>
          {armySelectionKeys.map((key, i) => {
            let items = sortBy(selections[key])
            if (key === 'units') {
              items = items.concat(allyUnits)
            }
            return <Tr theme={theme} items={items} title={key} key={`${key}_${i}`} />
          })}

          {realmscape && <Tr theme={theme} items={[realmscape]} title={'Realmscape'} />}

          {realmscape_feature && <Tr theme={theme} items={[realmscape_feature]} title={'Realm Feature'} />}
        </tbody>
      </table>
    </>
  )
}

interface ITrProps {
  title: string
  items: string[]
  theme: ITheme
}

const Tr = ({ title, items, theme }: ITrProps) => (
  <tr>
    <td className={`text-nowrap ${theme.textMuted}`}>
      <strong>{titleCase(title)}</strong>
    </td>
    <td>
      {items.map((item, i) => {
        return (
          <span key={`${item}_${i}`} className={`badge badge-secondary text-wrap mx-1`}>
            {item}
          </span>
        )
      })}
    </td>
  </tr>
)
