import produce from 'immer'
import { GRAND_ALLIANCE_FACTIONS, TGrandAllianceFactions, TGrandAlliances } from 'meta/alliances'
import { TSupportedFaction } from 'meta/factions'
import { getFactionFromList } from 'meta/faction_list'
import { IArmy, TCollection, TInitialArmy } from 'types/army'
import { TBattleRealms, TOriginRealms } from 'types/realmscapes'
import { isValidFactionName } from 'utils/armyUtils'
import { getAllianceItems, getGrandAllianceEndlessSpells } from 'utils/getArmy/getAllianceItems'
import { getCollection } from 'utils/getArmy/getCollection'
import { modify } from 'utils/getArmy/modify'
import { processGame } from 'utils/processGame'

/**
 *
 * @param factionName
 * @param subFactionName - If null, returns AggregateArmy
 * @param originRealm
 * @param realmscape
 */
export const getArmy = (
  factionName: TSupportedFaction | null,
  subFactionName: string | null = null,
  originRealm: TOriginRealms | null = null,
  realmscape: TBattleRealms | null = null
): IArmy | null => {
  if (!isValidFactionName(factionName)) return null

  const { GrandAlliance, subFactionArmies, AggregateArmy } = getFactionFromList(factionName)
  const Army = (subFactionName && subFactionArmies?.[subFactionName]) || AggregateArmy

  const Collection = getCollection(Army)

  const army = modifyArmy(Army as IArmy, {
    Collection,
    factionName,
    GrandAlliance,
    originRealm,
    realmscape,
  })

  return army
}

interface IModifyArmyMeta {
  Collection: TCollection
  factionName: TSupportedFaction
  GrandAlliance: TGrandAlliances
  originRealm: TOriginRealms | null
  realmscape: TBattleRealms | null
}

const modifyArmy = produce((Army: IArmy, meta: IModifyArmyMeta) => {
  let {
    AlliedUnits = [],
    Artifacts = [],
    Battalions = [],
    CommandAbilities = [],
    CommandTraits = [],
    EndlessSpells = [],
    Flavors = [],
    Prayers = [],
    Scenery = [],
    Spells = [],
    Triumphs = [],
    Units = [],
  } = Army as TInitialArmy
  const { realmscape, GrandAlliance, Collection, factionName, originRealm } = meta

  // TODO: Make sure this works
  const GrandAllianceEndlessSpells = getGrandAllianceEndlessSpells(GrandAlliance, EndlessSpells, factionName)

  if (GRAND_ALLIANCE_FACTIONS.includes(factionName as TGrandAllianceFactions)) {
    // TODO: Make sure all of this works
    Artifacts = getAllianceItems(GrandAlliance, 'Artifacts', Artifacts)
    Battalions = getAllianceItems(GrandAlliance, 'Battalions', Battalions)
    CommandAbilities = getAllianceItems(GrandAlliance, 'CommandAbilities', CommandAbilities)
    CommandTraits = getAllianceItems(GrandAlliance, 'CommandTraits', CommandTraits)
    EndlessSpells = GrandAllianceEndlessSpells
    Prayers = getAllianceItems(GrandAlliance, 'Prayers', Prayers)
    Spells = getAllianceItems(GrandAlliance, 'Spells', Spells)
    Units = getAllianceItems(GrandAlliance, 'Units', Units)
  }

  Army.Artifacts = modify.Artifacts(Artifacts, originRealm, GrandAlliance, Collection)
  Army.Battalions = modify.Battalions(Battalions, Collection)
  Army.CommandAbilities = modify.CommandAbilities(CommandAbilities, realmscape, Collection)
  Army.CommandTraits = modify.CommandTraits(CommandTraits, GrandAlliance, Collection)
  Army.EndlessSpells = modify.EndlessSpells(EndlessSpells, GrandAllianceEndlessSpells, Collection)
  Army.Flavors = modify.Flavors(Flavors, Collection)
  Army.Prayers = modify.Prayers(Prayers, Collection)
  Army.Scenery = modify.Scenery(Scenery, Collection)
  Army.Spells = modify.Spells(Spells, realmscape, Collection)
  Army.Triumphs = modify.Triumphs(Triumphs, Collection)
  Army.Units = modify.Units(Units, AlliedUnits, GrandAlliance, Collection)

  Army.Game = processGame([
    Army.Artifacts,
    Army.Battalions,
    Army.CommandAbilities,
    Army.CommandTraits,
    Army.EndlessSpells,
    Army.Flavors,
    Army.Prayers,
    Army.Scenery,
    Army.Spells,
    Army.Triumphs,
    Army.Units,
  ])

  return Army
})
