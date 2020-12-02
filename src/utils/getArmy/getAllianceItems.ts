import { sortBy, sortedUniqBy, without } from 'lodash'
import { CHAOS, DEATH, DESTRUCTION, ORDER, TGrandAlliances } from 'meta/alliances'
import {
  CHAOS_GRAND_ALLIANCE,
  DEATH_GRAND_ALLIANCE,
  DESTRUCTION_GRAND_ALLIANCE,
  KHARADRON_OVERLORDS,
  ORDER_GRAND_ALLIANCE,
  TSupportedFaction,
} from 'meta/factions'
import { getFactionList } from 'meta/faction_list'
import { IArmy } from 'types/army'
import { TEntry } from 'types/data'

/**
 * Gets all items associated with this grand alliance
 * @param grandAlliance
 * @param type
 */
export const getAllianceItems = (
  grandAlliance: TGrandAlliances,
  type: keyof IArmy,
  originalEntries: TEntry[] = []
): TEntry[] => {
  const factionName = {
    [CHAOS]: CHAOS_GRAND_ALLIANCE,
    [DEATH]: DEATH_GRAND_ALLIANCE,
    [DESTRUCTION]: DESTRUCTION_GRAND_ALLIANCE,
    [ORDER]: ORDER_GRAND_ALLIANCE,
  }[grandAlliance]

  return [] // todo

  const FactionList = getFactionList()

  return sortedUniqBy(
    sortBy(
      // (without(Object.keys(FactionList), factionName) as TSupportedFaction[])
      without(Object.keys(FactionList), factionName)
        .filter(faction => FactionList[faction].GrandAlliance === grandAlliance)
        .map(faction => FactionList[faction].AggregateArmy[type])
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
const getAllEndlessSpells = (): TEntry[] => {
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
  // TODO: REMOVE!!!!!!
  // @ts-ignore
  if (factionName === KHARADRON_OVERLORDS) {
    return getAllEndlessSpells()
  } else {
    return getAllianceItems(grandAlliance, 'EndlessSpells', originalEntries)
  }
}
