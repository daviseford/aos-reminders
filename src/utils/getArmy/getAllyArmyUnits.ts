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
import { CHAOS, DEATH, ORDER, DESTRUCTION } from 'meta/alliances'

type TAllyArmies = { [key in TSupportedFaction]: string[] }
type TGetAllyArmies = (factionName: string) => TAllyArmies

export const getAllyArmyUnits: TGetAllyArmies = factionName => {
  const ArmyList = getArmyList()
  const { GrandAlliance } = ArmyList[factionName]

  const allianceName = {
    [CHAOS]: CHAOS_GRAND_ALLIANCE,
    [DEATH]: DEATH_GRAND_ALLIANCE,
    [DESTRUCTION]: DESTRUCTION_GRAND_ALLIANCE,
    [ORDER]: ORDER_GRAND_ALLIANCE,
  }[GrandAlliance]

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
    ).concat(allianceName)
  )

  const allyArmies = allyFactionNames.reduce((a, faction) => {
    const units = ArmyList[faction].Army.Units || []
    a[faction] = units.map(({ name }) => name)
    return a
  }, {} as TAllyArmies)

  return allyArmies
}
