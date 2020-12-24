import produce from 'immer'
import { GRAND_ALLIANCE_FACTIONS, TGrandAllianceFactions, TGrandAlliances } from 'meta/alliances'
import { TSupportedFaction } from 'meta/factions'
import { getFactionFromList } from 'meta/faction_list'
import { IArmy, TCollection, TInitialArmy } from 'types/army'
import { TBattleRealms, TOriginRealms } from 'types/realmscapes'
import { isValidFactionName } from 'utils/armyUtils'
import { isDev } from 'utils/env'
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

  if (isDev && subFactionName && !subFactionArmies[subFactionName]) {
    console.warn(`Invalid subFactionName: '${subFactionName}'. Please fix this.`)
    debugger // If you've arrived here (as a dev), you need to fix the above error - no excuses.
  }

  const Army = (subFactionName && subFactionArmies?.[subFactionName]) || AggregateArmy

  const Collection = getCollection(Army)

  const army = modifyArmy(Army, {
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
    MountTraits = [],
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
    MountTraits = getAllianceItems(GrandAlliance, 'MountTraits', MountTraits) // new
    Prayers = getAllianceItems(GrandAlliance, 'Prayers', Prayers) // new
    Spells = getAllianceItems(GrandAlliance, 'Spells', Spells)
    Units = getAllianceItems(GrandAlliance, 'Units', Units)
  }

  Army.Artifacts = modify.Artifacts(Artifacts, originRealm, GrandAlliance, Collection)
  Army.Battalions = modify.Battalions(Battalions, Collection)
  Army.CommandAbilities = modify.CommandAbilities(CommandAbilities, realmscape, Collection)
  Army.CommandTraits = modify.CommandTraits(CommandTraits, GrandAlliance, Collection)
  Army.EndlessSpells = modify.EndlessSpells(EndlessSpells, GrandAllianceEndlessSpells, Collection)
  Army.Flavors = modify.Flavors(Flavors, Collection)
  Army.MountTraits = modify.MountTraits(MountTraits, Collection)
  Army.Prayers = modify.Prayers(Prayers, Collection)
  Army.Scenery = modify.Scenery(Scenery, Collection)
  Army.Spells = modify.Spells(Spells, realmscape, Collection)
  Army.Triumphs = modify.Triumphs(Triumphs, Collection)
  Army.Units = modify.Units(Units, AlliedUnits, GrandAlliance, Collection)

  Army.Game = processGame({
    artifacts: Army.Artifacts,
    battalions: Army.Battalions,
    command_abilities: Army.CommandAbilities,
    command_traits: Army.CommandTraits,
    endless_spells: Army.EndlessSpells,
    flavors: Army.Flavors,
    mount_traits: Army.MountTraits,
    prayers: Army.Prayers,
    scenery: Army.Scenery,
    spells: Army.Spells,
    triumphs: Army.Triumphs,
    units: Army.Units,
  })

  return Army
})
