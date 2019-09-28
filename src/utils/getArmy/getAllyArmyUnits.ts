import { uniq, without } from 'lodash'
import {
  CHAOS_GRAND_ALLIANCE,
  DEATH_GRAND_ALLIANCE,
  DESTRUCTION_GRAND_ALLIANCE,
  MERCENARY_COMPANIES,
  ORDER_GRAND_ALLIANCE,
  TSupportedFaction,
} from 'meta/factions'
import { getArmiesInfo, getArmyList } from 'meta/army_list'

type TAllyArmies = { [key in TSupportedFaction]: string[] }
type TGetAllyArmies = (factionName: TSupportedFaction) => Promise<TAllyArmies>

export const getAllyArmyUnits: TGetAllyArmies = async factionName => {
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
  ) as TSupportedFaction[]

  const allyArmies = await Promise.all(allyFactionNames.map(getArmyList))

  const allyUnits = allyArmies.reduce(
    (a, b) => {
      const units = b.Army.Units || []
      a[b.factionName] = units.map(({ name }) => name)
      return a
    },
    {} as TAllyArmies
  )

  // const allyUnits = allyFactionNames.reduce(
  //   (a, faction) => {
  //     a[faction] = allyArmies[faction].Army.Units.map(({ name }) => name)
  //     return a
  //   },
  //   {} as TAllyArmies
  // )

  return allyUnits
}
