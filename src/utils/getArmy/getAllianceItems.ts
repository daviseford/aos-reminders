import {
  CHAOS_GRAND_ALLIANCE,
  DEATH_GRAND_ALLIANCE,
  DESTRUCTION_GRAND_ALLIANCE,
  ORDER_GRAND_ALLIANCE,
  TSupportedFaction,
} from 'meta/factions'
import { DESTRUCTION, ORDER, CHAOS, DEATH, TGrandAlliances } from 'meta/alliances'
import { sortedUniqBy, sortBy, without } from 'lodash'
import { TEntry } from 'types/data'
import { getArmiesInfo, getArmyList } from 'meta/army_list'

type TType =
  | 'Artifacts'
  | 'Battalions'
  | 'Commands'
  | 'EndlessSpells'
  | 'Scenery'
  | 'Spells'
  | 'Traits'
  | 'Units'

/**
 * Gets all items associated with this grand alliance
 * @param grandAlliance
 * @param type
 */
export const getAllianceItems = async (
  grandAlliance: TGrandAlliances,
  type: TType,
  originalEntries: TEntry[] = []
): Promise<TEntry[]> => {
  const factionName = {
    [CHAOS]: CHAOS_GRAND_ALLIANCE,
    [DEATH]: DEATH_GRAND_ALLIANCE,
    [DESTRUCTION]: DESTRUCTION_GRAND_ALLIANCE,
    [ORDER]: ORDER_GRAND_ALLIANCE,
  }[grandAlliance]

  const armiesInfo = getArmiesInfo()
  const allyFactionNames = without(Object.keys(armiesInfo), factionName).filter(
    faction => armiesInfo[faction].GrandAlliance === grandAlliance
  ) as TSupportedFaction[]
  const allyArmies = await Promise.all(allyFactionNames.map(getArmyList))

  return sortedUniqBy(
    sortBy(
      allyArmies
        .map(army => army.Army[type])
        .filter(items => !!items && items.length > 0)
        .flat()
        .concat(originalEntries),
      'name'
    ),
    'name'
  )
}
