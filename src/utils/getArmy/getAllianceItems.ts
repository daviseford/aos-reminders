import { sortBy, sortedUniqBy, without } from 'lodash'
import { CHAOS, DEATH, DESTRUCTION, ORDER, TGrandAlliances } from 'meta/alliances'
import { getArmyList } from 'meta/army_list'
import {
  CHAOS_GRAND_ALLIANCE,
  DEATH_GRAND_ALLIANCE,
  DESTRUCTION_GRAND_ALLIANCE,
  KHARADRON_OVERLORDS,
  ORDER_GRAND_ALLIANCE,
  TSupportedFaction,
} from 'meta/factions'
import { TEntry } from 'types/data'

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

  const ArmyList = getArmyList()

  return sortedUniqBy(
    sortBy(
      without(Object.keys(ArmyList), factionName)
        .filter(faction => ArmyList[faction].GrandAlliance === grandAlliance)
        .map(faction => ArmyList[faction].Army[type])
        .filter(items => !!items && items.length > 0)
        .flat()
        .concat(originalEntries),
      'name'
    ),
    'name'
  )
}

/**
 * Used for KO, since they can take ANY endless spell in the game now
 */
export const getAllEndlessSpells = (): TEntry[] => {
  return [
    ...getAllianceItems(CHAOS, 'EndlessSpells', []),
    ...getAllianceItems(DEATH, 'EndlessSpells', []),
    ...getAllianceItems(DESTRUCTION, 'EndlessSpells', []),
    ...getAllianceItems(ORDER, 'EndlessSpells', []),
  ]
}

export const getGrandAllianceEndlessSpells = (
  grandAlliance: TGrandAlliances,
  originalEntries: TEntry[] = [],
  factionName: TSupportedFaction
): TEntry[] => {
  if (factionName === KHARADRON_OVERLORDS) {
    return getAllEndlessSpells()
  } else {
    return getAllianceItems(grandAlliance, 'EndlessSpells', originalEntries)
  }
}
