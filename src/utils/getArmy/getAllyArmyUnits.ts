import { IArmy } from 'types/army'
import { isValidFactionName } from 'utils/armyUtils'
import { ArmyList } from 'meta/army_list'
import { MERCENARY_COMPANIES, TSupportedFaction } from 'meta/factions'
import { uniq, without } from 'lodash'

type TAllyArmies = { [key in TSupportedFaction]: IArmy['Units'] }
type TGetAllyArmies = (factionName: string) => TAllyArmies | null

export const getAllyArmyUnits: TGetAllyArmies = factionName => {
  if (!isValidFactionName(factionName)) return null

  const { GrandAlliance } = ArmyList[factionName]

  const allyFactionNames = uniq(
    without(
      Object.keys(ArmyList)
        .filter(x => ArmyList[x].GrandAlliance === GrandAlliance)
        .concat(MERCENARY_COMPANIES)
    )
  )

  const allyArmies = allyFactionNames.reduce(
    (a, faction) => {
      a[faction] = ArmyList[faction].Units
      return a
    },
    {} as TAllyArmies
  )

  return allyArmies
}
