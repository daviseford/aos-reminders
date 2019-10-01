import { uniq, without } from 'lodash'
import {
  CHAOS_GRAND_ALLIANCE,
  DEATH_GRAND_ALLIANCE,
  DESTRUCTION_GRAND_ALLIANCE,
  MERCENARY_COMPANIES,
  ORDER_GRAND_ALLIANCE,
  TSupportedFaction,
} from 'meta/factions'
import { getArmyList } from 'meta/army_list'

type TAllyArmies = { [key in TSupportedFaction]: string[] }
type TGetAllyArmies = (factionName: string) => TAllyArmies

export const getAllyArmyUnits: TGetAllyArmies = factionName => {
  const ArmyList = getArmyList()
  const { GrandAlliance } = ArmyList[factionName]

  const allyFactionNames = uniq(
    without(
      Object.keys(ArmyList)
        .filter(x => ArmyList[x].GrandAlliance === GrandAlliance)
        .concat(MERCENARY_COMPANIES),
      ...[
        factionName,
        CHAOS_GRAND_ALLIANCE,
        DEATH_GRAND_ALLIANCE,
        DESTRUCTION_GRAND_ALLIANCE,
        ORDER_GRAND_ALLIANCE,
      ]
    )
  )

  const allyArmies = allyFactionNames.reduce(
    (a, faction) => {
      a[faction] = ArmyList[faction].Army.Units.map(({ name }) => name)
      return a
    },
    {} as TAllyArmies
  )

  return allyArmies
}
