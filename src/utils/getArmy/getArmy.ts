import produce from 'immer'
import { processGame } from 'utils/processGame'
import { getAllianceItems, getGrandAllianceEndlessSpells } from 'utils/getArmy/getAllianceItems'
import { getCollection } from 'utils/getArmy/getCollection'
import { modify } from 'utils/getArmy/modify'
import { isValidFactionName } from 'utils/armyUtils'
import { TGrandAlliances, GRAND_ALLIANCE_FACTIONS, TGrandAllianceFactions } from 'meta/alliances'
import { getArmyFromList } from 'meta/army_list'
import { TSupportedFaction } from 'meta/factions'
import { IArmy, ICollection, IInitialArmy } from 'types/army'
import { TBattleRealms, TOriginRealms } from 'types/realmscapes'

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
    Allegiances = [],
    AlliedUnits = [],
    Artifacts = [],
    Battalions = [],
    EndlessSpells = [],
    Scenery = [],
    Spells = [],
    Traits = [],
    Units = [],
  } = Army as IInitialArmy
  const { realmscape, GrandAlliance, Collection, factionName, originRealm } = meta

  const GrandAllianceEndlessSpells = getGrandAllianceEndlessSpells(GrandAlliance, EndlessSpells, factionName)

  if (GRAND_ALLIANCE_FACTIONS.includes(factionName as TGrandAllianceFactions)) {
    Artifacts = getAllianceItems(GrandAlliance, 'Artifacts', Artifacts)
    Battalions = getAllianceItems(GrandAlliance, 'Battalions', Battalions)
    EndlessSpells = GrandAllianceEndlessSpells
    Spells = getAllianceItems(GrandAlliance, 'Spells', Spells)
    Traits = getAllianceItems(GrandAlliance, 'Traits', Traits)
    Units = getAllianceItems(GrandAlliance, 'Units', Units)
  }

  Army.Allegiances = modify.Allegiances(Allegiances)
  Army.Artifacts = modify.Artifacts(Artifacts, originRealm, GrandAlliance, Collection)
  Army.Battalions = modify.Battalions(Battalions)
  Army.Commands = modify.Commands(realmscape, Collection)
  Army.EndlessSpells = modify.EndlessSpells(GrandAllianceEndlessSpells, factionName)
  Army.Scenery = modify.Scenery(Scenery)
  Army.Spells = modify.Spells(Spells, realmscape, Collection)
  Army.Traits = modify.Traits(Traits, GrandAlliance, Collection)
  Army.Triumphs = modify.Triumphs()
  Army.Units = modify.Units(Units, AlliedUnits, GrandAlliance)
  Army.Game = processGame([
    Army.Allegiances,
    Army.Artifacts,
    Army.Battalions,
    Army.Commands,
    Army.EndlessSpells,
    Army.Scenery,
    Army.Spells,
    Army.Traits,
    Army.Triumphs,
    Army.Units,
  ])

  return Army
})
