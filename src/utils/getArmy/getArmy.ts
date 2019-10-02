import produce from 'immer'
import { processGame } from '../processGame'
import { TGrandAlliances, GRAND_ALLIANCE_FACTIONS, TGrandAllianceFactions } from 'meta/alliances'
import { TSupportedFaction } from 'meta/factions'
import { IArmy, ICollection, IInitialArmy } from 'types/army'
import { TRealms } from 'types/realmscapes'
import { getAllianceItems } from './getAllianceItems'
import { getCollection } from './getCollection'
import { modify } from './modify'
import { isValidFactionName } from 'utils/armyUtils'
import { getArmyFromList } from 'meta/army_list'

export const getArmy = (
  factionName: TSupportedFaction | null,
  realmscape: TRealms | null = null
): IArmy | null => {
  if (!isValidFactionName(factionName)) return null

  const { Army, GrandAlliance } = getArmyFromList(factionName)

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
    AlliedUnits = [],
    Artifacts = [],
    Battalions = [],
    EndlessSpells = [],
    Scenery = [],
    Spells = [],
    Traits = [],
    Units = [],
  } = Army as IInitialArmy
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
  Army.Units = modify.Units([...Units, ...AlliedUnits], GrandAlliance)
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
