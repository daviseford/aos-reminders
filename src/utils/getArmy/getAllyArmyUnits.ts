import { uniq, without } from 'lodash'
import { isValidFactionName } from 'utils/armyUtils'
import {
  MERCENARY_COMPANIES,
  TSupportedFaction,
  CHAOS_GRAND_ALLIANCE,
  ORDER_GRAND_ALLIANCE,
  DESTRUCTION_GRAND_ALLIANCE,
  DEATH_GRAND_ALLIANCE,
} from 'meta/factions'
import { IArmy } from 'types/army'
import { ArmyList } from 'meta/army_list'

type TAllyArmies = { [key in TSupportedFaction]: IArmy['Units'] }
type TGetAllyArmies = (factionName: string) => TAllyArmies | null

export const getAllyArmyUnits: TGetAllyArmies = factionName => {
  if (!isValidFactionName(factionName)) return null

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
      a[faction] = ArmyList[faction].Units
      return a
    },
    {} as TAllyArmies
  )

  return allyArmies
}
