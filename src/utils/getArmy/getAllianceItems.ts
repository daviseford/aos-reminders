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
import { TEntry, upperToLowerLookup } from 'types/data'

/**
 * Gets all items associated with this grand alliance
 * @param grandAlliance
 * @param type
 */
export const getAllianceItems = (
  grandAlliance: TGrandAlliances,
  type: keyof typeof upperToLowerLookup,
  originalEntries: TEntry[] = []
): TEntry[] => {
  const factionName = {
    [CHAOS]: CHAOS_GRAND_ALLIANCE,
    [DEATH]: DEATH_GRAND_ALLIANCE,
    [DESTRUCTION]: DESTRUCTION_GRAND_ALLIANCE,
    [ORDER]: ORDER_GRAND_ALLIANCE,
  }[grandAlliance]

  const FactionList = getFactionList()

  const allianceItems = without(Object.keys(FactionList), factionName).reduce((a, k) => {
    let faction = k as TSupportedFaction

    // Skip on these conditions
    if (!FactionList?.[faction] || FactionList[faction].GrandAlliance !== grandAlliance) {
      return a
    }

    const _values = FactionList[faction].AggregateArmy?.[type]
    if (_values) a = a.concat(..._values)

    return a
  }, [] as TEntry[])

  return sortedUniqBy(sortBy(allianceItems.concat(originalEntries), 'name'), 'name')
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
