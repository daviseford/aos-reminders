import { CoreRules } from 'generic_rules'
import produce from 'immer'
import { GRAND_ALLIANCE_FACTIONS, TGrandAllianceFactions, TGrandAlliances } from 'meta/alliances'
import { TSupportedFaction } from 'meta/factions'
import { getFactionFromList } from 'meta/faction_list'
import { IArmy, TCollection, TSubfactionArmy } from 'types/army'
import { RealmscapesEnum } from 'types/realmscapes'
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
  originRealm: RealmscapesEnum | null = null,
  realmscape: RealmscapesEnum | null = null
): IArmy | null => {
  if (!isValidFactionName(factionName)) return null

  const { GrandAlliance, subFactionArmies, AggregateArmy } = getFactionFromList(factionName)

  if (isDev && subFactionName && !subFactionArmies[subFactionName]) {
    console.warn(`Invalid subFactionName: '${subFactionName}'. Please fix this.`)
    // eslint-disable-next-line no-debugger
    debugger // If you've arrived here (as a dev), you need to fix the above error - no excuses.
  }

  const Army: TSubfactionArmy = (subFactionName && subFactionArmies?.[subFactionName]) || AggregateArmy

  const Collection = getCollection(Army)

  const army = modifyArmy(Army, {
    Collection,
    factionName,
    GrandAlliance,
    originRealm,
    realmscape,
  })

  return army as unknown as IArmy
}

interface IModifyArmyMeta {
  Collection: TCollection
  factionName: TSupportedFaction
  GrandAlliance: TGrandAlliances
  originRealm: RealmscapesEnum | null
  realmscape: RealmscapesEnum | null
}

const modifyArmy = produce((Army: TSubfactionArmy, meta: IModifyArmyMeta) => {
  const {
    AlliedUnits = [],
    BattleTactics = [],
    Flavors = [],
    GrandStrategies = [],
    Incarnates = [],
    Scenery = [],
    Triumphs = [],
  } = Army
  let {
    Artifacts = [],
    Battalions = [],
    CommandAbilities = [],
    CommandTraits = [],
    EndlessSpells = [],
    MonstrousRampages = [],
    MountTraits = [],
    Prayers = [],
    Spells = [],
    Units = [],
  } = Army
  const { GrandAlliance, Collection, factionName } = meta

  // TODO: Make sure this works
  const GrandAllianceEndlessSpells = getGrandAllianceEndlessSpells(GrandAlliance, EndlessSpells, factionName)

  if (GRAND_ALLIANCE_FACTIONS.includes(factionName as TGrandAllianceFactions)) {
    // TODO: Make sure all of this works
    Artifacts = getAllianceItems(GrandAlliance, 'Artifacts', Artifacts)
    Battalions = getAllianceItems(GrandAlliance, 'Battalions', Battalions)
    CommandAbilities = getAllianceItems(GrandAlliance, 'CommandAbilities', CommandAbilities)
    CommandTraits = getAllianceItems(GrandAlliance, 'CommandTraits', CommandTraits)
    EndlessSpells = GrandAllianceEndlessSpells
    MonstrousRampages = getAllianceItems(GrandAlliance, 'MonstrousRampages', MonstrousRampages)
    MountTraits = getAllianceItems(GrandAlliance, 'MountTraits', MountTraits) // new
    Prayers = getAllianceItems(GrandAlliance, 'Prayers', Prayers) // new
    Spells = getAllianceItems(GrandAlliance, 'Spells', Spells)
    Units = getAllianceItems(GrandAlliance, 'Units', Units)
  }

  Army.Artifacts = modify.Artifacts(Artifacts, GrandAlliance, Collection)
  Army.Battalions = modify.Battalions(Battalions, Collection)
  Army.BattleTactics = modify.BattleTactics(BattleTactics, Collection)
  Army.CommandAbilities = modify.CommandAbilities(CommandAbilities, Collection)
  Army.CommandTraits = modify.CommandTraits(CommandTraits, GrandAlliance, Collection)
  Army.CoreRules = modify.CoreRules(CoreRules)
  Army.EndlessSpells = modify.EndlessSpells(EndlessSpells, GrandAllianceEndlessSpells, Collection)
  Army.Flavors = modify.Flavors(Flavors, Collection)
  Army.GrandStrategies = modify.GrandStrategies(GrandStrategies, Collection)
  Army.Incarnates = modify.Incarnates(Incarnates, Collection)
  Army.MonstrousRampages = modify.MonstrousRampages(MonstrousRampages, Collection)
  Army.MountTraits = modify.MountTraits(MountTraits, Collection)
  Army.Prayers = modify.Prayers(Prayers, Collection)
  Army.Scenery = modify.Scenery(Scenery, Collection)
  Army.Spells = modify.Spells(Spells, Collection)
  Army.Triumphs = modify.Triumphs(Triumphs, Collection)
  Army.Units = modify.Units(Units, AlliedUnits, GrandAlliance, Collection)

  // @ts-expect-error ignore this
  Army.Game = processGame([
    Army.Artifacts,
    Army.Battalions,
    Army.BattleTactics,
    Army.CommandAbilities,
    Army.CommandTraits,
    Army.CoreRules,
    Army.EndlessSpells,
    Army.Flavors,
    Army.GrandStrategies,
    Army.Incarnates,
    Army.MonstrousRampages,
    Army.MountTraits,
    Army.Prayers,
    Army.Scenery,
    Army.Spells,
    Army.Triumphs,
    Army.Units,
  ])

  return Army
})
