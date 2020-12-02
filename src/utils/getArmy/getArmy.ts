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
  const Army = subFactionName ? subFactionArmies[subFactionName] : AggregateArmy

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
    CommandTraits = [],
    EndlessSpells = [],
    Flavors = [],
    Scenery = [],
    Spells = [],
    Units = [],
  } = Army as TInitialArmy
  const { realmscape, GrandAlliance, Collection, factionName, originRealm } = meta

  const GrandAllianceEndlessSpells = getGrandAllianceEndlessSpells(GrandAlliance, EndlessSpells, factionName)

  if (GRAND_ALLIANCE_FACTIONS.includes(factionName as TGrandAllianceFactions)) {
    Artifacts = getAllianceItems(GrandAlliance, 'Artifacts', Artifacts)
    Battalions = getAllianceItems(GrandAlliance, 'Battalions', Battalions)
    EndlessSpells = GrandAllianceEndlessSpells
    Spells = getAllianceItems(GrandAlliance, 'Spells', Spells)
    CommandTraits = getAllianceItems(GrandAlliance, 'CommandTraits', CommandTraits)
    Units = getAllianceItems(GrandAlliance, 'Units', Units)
  }

  Army.Artifacts = modify.Artifacts(Artifacts, originRealm, GrandAlliance, Collection)
  Army.Battalions = modify.Battalions(Battalions)
  Army.CommandAbilities = modify.CommandAbilities(realmscape, Collection)
  Army.CommandTraits = modify.CommandTraits(CommandTraits, GrandAlliance, Collection)
  Army.EndlessSpells = modify.EndlessSpells(GrandAllianceEndlessSpells)
  Army.Flavors = modify.Flavors(Flavors)
  Army.Scenery = modify.Scenery(Scenery)
  Army.Spells = modify.Spells(Spells, realmscape, Collection)
  Army.Triumphs = modify.Triumphs()
  Army.Units = modify.Units(Units, AlliedUnits, GrandAlliance)
  Army.Game = processGame([
    Army.Artifacts,
    Army.Battalions,
    Army.CommandAbilities,
    Army.CommandTraits,
    Army.EndlessSpells,
    Army.Flavors,
    Army.Scenery,
    Army.Spells,
    Army.Triumphs,
    Army.Units,
  ])

  return Army
})
