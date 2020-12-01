import produce from 'immer'
import { GRAND_ALLIANCE_FACTIONS, TGrandAllianceFactions, TGrandAlliances } from 'meta/alliances'
import { getArmyFromList } from 'meta/army_list'
import { TSupportedFaction } from 'meta/factions'
import { IArmy, ICollection, IInitialArmy } from 'types/army'
import { TBattleRealms, TOriginRealms } from 'types/realmscapes'
import { isValidFactionName } from 'utils/armyUtils'
import { getAllianceItems, getGrandAllianceEndlessSpells } from 'utils/getArmy/getAllianceItems'
import { getCollection } from 'utils/getArmy/getCollection'
import { modify } from 'utils/getArmy/modify'
import { processGame } from 'utils/processGame'

export const getArmy = (
  factionName: TSupportedFaction | null,
  originRealm: TOriginRealms | null = null,
  realmscape: TBattleRealms | null = null
): IArmy | null => {
  if (!isValidFactionName(factionName)) return null

  const { Army, GrandAlliance } = getArmyFromList(factionName)

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
  Collection: ICollection
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
  } = Army as IInitialArmy
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

  Army.Flavors = modify.Flavors(Flavors)
  Army.Artifacts = modify.Artifacts(Artifacts, originRealm, GrandAlliance, Collection)
  Army.Battalions = modify.Battalions(Battalions)
  Army.CommandAbilities = modify.CommandAbilities(realmscape, Collection)
  Army.EndlessSpells = modify.EndlessSpells(GrandAllianceEndlessSpells)
  Army.Scenery = modify.Scenery(Scenery)
  Army.Spells = modify.Spells(Spells, realmscape, Collection)
  Army.CommandTraits = modify.CommandTraits(CommandTraits, GrandAlliance, Collection)
  Army.Triumphs = modify.Triumphs()
  Army.Units = modify.Units(Units, AlliedUnits, GrandAlliance)
  Army.Game = processGame([
    Army.Flavors,
    Army.Artifacts,
    Army.Battalions,
    Army.CommandAbilities,
    Army.EndlessSpells,
    Army.Scenery,
    Army.Spells,
    Army.CommandTraits,
    Army.Triumphs,
    Army.Units,
  ])

  return Army
})
