import { uniq, without } from 'lodash'
import { CHAOS, DEATH, DESTRUCTION, ORDER } from 'meta/alliances'
import {
  CHAOS_GRAND_ALLIANCE,
  DEATH_GRAND_ALLIANCE,
  DESTRUCTION_GRAND_ALLIANCE,
  MEGA_GARGANT_MERCENARIES,
  MERCENARY_COMPANIES,
  ORDER_GRAND_ALLIANCE,
  TSupportedFaction,
} from 'meta/factions'
import { getFactionList } from 'meta/faction_list'

type TAllyArmies = Record<TSupportedFaction, { units: string[]; battalions: string[] }>
type TGetAllyArmyItems = (factionName: string) => TAllyArmies

export const getAllyArmyItems: TGetAllyArmyItems = factionName => {
  const ArmyList = getFactionList()
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
        .concat(MERCENARY_COMPANIES, MEGA_GARGANT_MERCENARIES),
      ...[
        factionName,
        CHAOS_GRAND_ALLIANCE,
        DEATH_GRAND_ALLIANCE,
        DESTRUCTION_GRAND_ALLIANCE,
        ORDER_GRAND_ALLIANCE,
      ]
    ).concat(allianceName)
  ) as TSupportedFaction[]

  const allyArmies = allyFactionNames.reduce((a, faction) => {
    const battalions = ArmyList[faction].AggregateArmy.Battalions || []
    const units = ArmyList[faction].AggregateArmy.Units || []
    a[faction] = {
      battalions: battalions.map(({ name }) => name),
      units: units.map(({ name }) => name),
    }
    return a
  }, {} as TAllyArmies)

  return allyArmies
}
