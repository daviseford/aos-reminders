import { useTheme } from 'context/useTheme'
import { sortBy } from 'lodash'
import React, { useMemo } from 'react'
import { ISavedArmy, ISavedArmyFromApi } from 'types/savedArmy'
import { IAllySelections } from 'types/selections'
import { ITheme } from 'types/theme'
import { titleCase } from 'utils/textUtils'

interface ISavedArmyTable {
  army: ISavedArmyFromApi | ISavedArmy
}

export const SavedArmyTable: React.FC<ISavedArmyTable> = ({ army }) => {
  const { selections, allySelections, origin_realm, realmscape, realmscape_feature } = army
  const { theme } = useTheme()

  const armySelectionKeys = useMemo(
    () => sortBy(Object.keys(selections).filter(key => selections[key].length)),
    [selections]
  )
  const allies = useMemo(
    () =>
      Object.keys(allySelections).reduce(
        (a, factionName) => {
          a.units = a.units.concat(allySelections[factionName].units || [])
          a.battalions = a.battalions.concat(allySelections[factionName].battalions || [])
          return a
        },
        { units: [], battalions: [] } as IAllySelections
      ),
    [allySelections]
  )

  return (
    <>
      <table className={`table table-sm`}>
        <tbody>
          {armySelectionKeys.map((key, i) => {
            return <Tr theme={theme} items={sortBy(selections[key])} title={key} key={`${key}_${i}`} />
          })}

          {allies.units.length > 0 && (
            <Tr theme={theme} items={sortBy(allies.units)} title={'Allied Units'} />
          )}
          {allies.battalions.length > 0 && (
            <Tr theme={theme} items={sortBy(allies.battalions)} title={'Allied Battalions'} />
          )}

          {origin_realm && <Tr theme={theme} items={[origin_realm]} title={'Realm of Origin'} />}
          {realmscape && <Tr theme={theme} items={[realmscape]} title={'Realm of Battle'} />}
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
