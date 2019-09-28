import {
  CHAOS_GRAND_ALLIANCE,
  DEATH_GRAND_ALLIANCE,
  DESTRUCTION_GRAND_ALLIANCE,
  ORDER_GRAND_ALLIANCE,
} from 'meta/factions'
import { DESTRUCTION, ORDER, CHAOS, DEATH, TGrandAlliances } from 'meta/alliances'
import { sortedUniqBy, sortBy, without } from 'lodash'
import { TEntry } from 'types/data'
import { getArmiesInfo } from 'meta/army_list'

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
export const getAllianceItems = (
  grandAlliance: TGrandAlliances,
  type: TType,
  originalEntries: TEntry[] = []
): TEntry[] => {
  const factionName = {
    [CHAOS]: CHAOS_GRAND_ALLIANCE,
    [DEATH]: DEATH_GRAND_ALLIANCE,
    [DESTRUCTION]: DESTRUCTION_GRAND_ALLIANCE,
    [ORDER]: ORDER_GRAND_ALLIANCE,
  }[grandAlliance]

  const armiesInfo = getArmiesInfo()

  return sortedUniqBy(
    sortBy(
      without(Object.keys(armiesInfo), factionName)
        .filter(faction => armiesInfo[faction].GrandAlliance === grandAlliance)
        .map(faction => armiesInfo[faction].Army[type])
        .filter(items => !!items && items.length > 0)
        .flat()
        .concat(originalEntries),
      'name'
    ),
    'name'
  )
}
