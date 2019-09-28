import { uniq, without } from 'lodash-es'
import {
  CHAOS_GRAND_ALLIANCE,
  DEATH_GRAND_ALLIANCE,
  DESTRUCTION_GRAND_ALLIANCE,
  MERCENARY_COMPANIES,
  ORDER_GRAND_ALLIANCE,
  TSupportedFaction,
} from 'meta/factions'
import { getArmiesInfo } from 'meta/army_list'

type TAllyArmies = { [key in TSupportedFaction]: string[] }
type TGetAllyArmies = (factionName: TSupportedFaction) => TAllyArmies

export const getAllyArmyUnits: TGetAllyArmies = factionName => {
  const armiesInfo = getArmiesInfo()
  const { GrandAlliance } = armiesInfo[factionName]

  const allyFactionNames = uniq(
    without(
      Object.keys(armiesInfo)
        .filter(x => armiesInfo[x].GrandAlliance === GrandAlliance)
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
      a[faction] = armiesInfo[faction].Army.Units.map(({ name }) => name)
      return a
    },
    {} as TAllyArmies
  )

  return allyArmies
}
