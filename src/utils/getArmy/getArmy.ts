import produce from 'immer'
import { processGame } from '../processGame'
import { TGrandAlliances, GRAND_ALLIANCE_FACTIONS, TGrandAllianceFactions } from 'meta/alliances'
import { ArmyList } from 'meta/army_list'
import { TSupportedFaction, SUPPORTED_FACTIONS } from 'meta/factions'
import { IArmy, ICollection } from 'types/army'
import { TRealms } from 'types/realmscapes'
import { getAllianceItems } from '../getAllianceItems'
import { getCollection } from './getCollection'
import { modify } from './modify'

export const getArmy = (
  factionName: TSupportedFaction | null,
  realmscape: TRealms | null = null
): IArmy | null => {
  if (!factionName || !SUPPORTED_FACTIONS.includes(factionName as TSupportedFaction)) return null

  const { Army, GrandAlliance } = ArmyList[factionName]

  const Collection = getCollection(Army)

  const army = modifyArmy(Army, { realmscape, GrandAlliance, Collection, factionName })

  return army
}

interface IModifyArmyMeta {
  Collection: ICollection
  GrandAlliance: TGrandAlliances
  realmscape: TRealms | null
  factionName: TSupportedFaction
}

const modifyArmy = produce((Army: IArmy, meta: IModifyArmyMeta) => {
  let {
    Allegiances = [],
    Artifacts = [],
    Battalions = [],
    EndlessSpells = [],
    Scenery = [],
    Spells = [],
    Traits = [],
    Units = [],
  } = Army
  const { realmscape, GrandAlliance, Collection, factionName } = meta

  if (GRAND_ALLIANCE_FACTIONS.includes(factionName as TGrandAllianceFactions)) {
    Artifacts = getAllianceItems(GrandAlliance, 'Artifacts', Artifacts)
    Battalions = getAllianceItems(GrandAlliance, 'Battalions', Battalions)
    EndlessSpells = getAllianceItems(GrandAlliance, 'EndlessSpells', EndlessSpells)
    Spells = getAllianceItems(GrandAlliance, 'Spells', Spells)
    Traits = getAllianceItems(GrandAlliance, 'Traits', Traits)
    Units = getAllianceItems(GrandAlliance, 'Units', Units)
  }

  Army.Allegiances = modify.Allegiances(Allegiances)
  Army.Artifacts = modify.Artifacts(Artifacts, GrandAlliance, Collection)
  Army.Battalions = modify.Battalions(Battalions)
  Army.Commands = modify.Commands(realmscape, Collection)
  Army.EndlessSpells = modify.EndlessSpells(EndlessSpells)
  Army.Scenery = modify.Scenery(Scenery)
  Army.Spells = modify.Spells(Spells, realmscape, Collection)
  Army.Traits = modify.Traits(Traits, GrandAlliance, Collection)
  Army.Triumphs = modify.Triumphs()
  Army.Units = modify.Units(Units, GrandAlliance)
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
