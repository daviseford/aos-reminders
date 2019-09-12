import produce from 'immer'
import { sortBy, uniqBy } from 'lodash'
import { processGame } from './processGame'

import {
  GenericCommands,
  GenericEndlessSpells,
  GenericScenery,
  GenericSpells,
  GenericTriumphs,
  RealmArtifacts,
  RealmscapeCommands,
  RealmscapeSpells,
} from 'army/generic'

import {
  ChaosArtifacts,
  ChaosTraits,
  ChaosUnits,
  DeathArtifacts,
  DeathTraits,
  DeathUnits,
  DestructionArtifacts,
  DestructionTraits,
  DestructionUnits,
  OrderArtifacts,
  OrderTraits,
  OrderUnits,
} from 'army/grand_alliances'
import {
  CHAOS,
  DEATH,
  DESTRUCTION,
  ORDER,
  TGrandAlliances,
  GRAND_ALLIANCE_FACTIONS,
  TGrandAllianceFactions,
} from 'meta/alliances'
import { ArmyList } from 'meta/army_list'
import { TSupportedFaction, SUPPORTED_FACTIONS } from 'meta/factions'
import {
  IArmy,
  ICollection,
  IInitialArmy,
  TAllegiances,
  TArtifacts,
  TBattalions,
  TCommands,
  TEndlessSpells,
  TScenery,
  TSpells,
  TTraits,
  TTriumphs,
  TUnits,
} from 'types/army'
import { TRealms } from 'types/realmscapes'
import { TEffects, TEntry } from 'types/data'
import { getAllianceItems } from './getAllianceItems'

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

  Army.Allegiances = modifyAllegiances(Allegiances)
  Army.Artifacts = modifyArtifacts(Artifacts, GrandAlliance, Collection)
  Army.Battalions = modifyBattalions(Battalions)
  Army.Commands = modifyCommands(realmscape, Collection)
  Army.EndlessSpells = modifyEndlessSpells(EndlessSpells)
  Army.Scenery = modifyScenery(Scenery)
  Army.Spells = modifySpells(Spells, realmscape, Collection)
  Army.Traits = modifyTraits(Traits, GrandAlliance, Collection)
  Army.Triumphs = getTriumphs()
  Army.Units = modifyUnits(Units, GrandAlliance)
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

const modifyAllegiances = (allegiances: TAllegiances): TAllegiances => sortBy(allegiances, 'name')
const modifyBattalions = (battalions: TBattalions): TBattalions => sortBy(battalions, 'name')

const modifyUnits = (units: TUnits, alliance: TGrandAlliances): TUnits => {
  const { Units } = GrandAllianceConfig[alliance]
  return uniqBy(units.concat(sortBy(Units, 'name')).map(u => ({ ...u, unit: true })), 'name')
}

const modifyArtifacts = (
  artifacts: TArtifacts,
  alliance: TGrandAlliances,
  Collection: ICollection
): TArtifacts => {
  const { Artifacts } = GrandAllianceConfig[alliance]
  return uniqBy(
    artifacts
      .concat(Collection.Artifacts)
      .concat(Artifacts)
      .concat(RealmArtifacts)
      .map(a => ({ ...a, artifact: true })),
    'name'
  )
}

const modifyTraits = (traits: TTraits, alliance: TGrandAlliances, Collection: ICollection): TTraits => {
  const { Traits } = GrandAllianceConfig[alliance]
  return uniqBy(
    traits
      .concat(Collection.Traits)
      .concat(Traits)
      .map(t => ({ ...t, command_trait: true })),
    'name'
  )
}

const modifyCommands = (realmscape: TRealms | null, Collection: ICollection): TCommands => {
  const realmCommands = realmscape ? RealmscapeCommands.filter(c => c.name.includes(realmscape)) : []
  return uniqBy(
    Collection.Commands.concat(sortBy(GenericCommands, 'name'))
      .concat(sortBy(realmCommands, 'name'))
      .map(c => ({ ...c, command_ability: true })),
    'name'
  )
}

const getTriumphs = (): TTriumphs => {
  return sortBy(GenericTriumphs, 'name').map(t => ({ ...t, triumph: true }))
}

const modifySpells = (spells: TSpells, realmscape: TRealms | null, Collection: ICollection): TSpells => {
  const realmSpells = realmscape ? RealmscapeSpells.filter(s => s.name.includes(realmscape)) : []
  return uniqBy(
    sortBy(spells, 'name')
      .concat(Collection.Spells)
      .concat(sortBy(realmSpells, 'name'))
      .concat(sortBy(GenericSpells, 'name'))
      .map(s => ({ ...s, spell: true })),
    'name'
  )
}

const modifyScenery = (scenery: TScenery): TScenery => {
  return sortBy(scenery, 'name')
    .concat(sortBy(GenericScenery, 'name'))
    .map(s => ({ ...s, scenery: true }))
}

const modifyEndlessSpells = (endlessSpells: TEndlessSpells): TEndlessSpells => {
  return sortBy(endlessSpells, 'name')
    .concat(sortBy(GenericEndlessSpells, 'name'))
    .map(e => ({ ...e, endless_spell: true }))
}

type IGrandAllianceConfig = {
  readonly [key in TGrandAlliances]: {
    readonly Artifacts: TArtifacts
    readonly Traits: TTraits
    readonly Units: TUnits
  }
}

const GrandAllianceConfig: IGrandAllianceConfig = {
  [CHAOS]: {
    Artifacts: ChaosArtifacts,
    Traits: ChaosTraits,
    Units: ChaosUnits,
  },
  [DEATH]: {
    Artifacts: DeathArtifacts,
    Traits: DeathTraits,
    Units: DeathUnits,
  },
  [DESTRUCTION]: {
    Artifacts: DestructionArtifacts,
    Traits: DestructionTraits,
    Units: DestructionUnits,
  },
  [ORDER]: {
    Artifacts: OrderArtifacts,
    Traits: OrderTraits,
    Units: OrderUnits,
  },
}

/**
 * There are spells/artifacts/etc that only occur if a certain
 * allegiance/battalion/unit is selected. We want to make sure
 * that those are represented in the dropdowns.
 * @param army
 */
const getCollection = (army: IInitialArmy): ICollection => {
  const { Allegiances = [], Artifacts = [], Battalions = [], Scenery = [], Traits = [], Units = [] } = army

  const Collection = {
    Artifacts: [] as TArtifacts,
    Battalions: [] as TBattalions,
    Commands: [] as TCommands,
    Spells: [] as TSpells,
    Traits: [] as TTraits,
  }

  // Brute force it
  const types = [Allegiances, Artifacts, Battalions, Scenery, Traits, Units]

  // Go through each thing and get spells, artifacts, etc that are unusual
  types.forEach(items =>
    items.forEach(item => {
      item.effects.forEach(effect => {
        if (effect.spell) {
          addToCollection(effect, Collection.Spells)
        } else if (effect.artifact) {
          addToCollection(effect, Collection.Artifacts)
        } else if (effect.command_trait) {
          addToCollection(effect, Collection.Traits)
        } else if (effect.command_ability) {
          addToCollection(effect, Collection.Commands)
        }
      })
    })
  )

  return {
    Artifacts: sortBy(Collection.Artifacts, 'name'),
    Battalions: sortBy(Collection.Battalions, 'name'),
    Commands: sortBy(Collection.Commands, 'name'),
    Spells: sortBy(Collection.Spells, 'name'),
    Traits: sortBy(Collection.Traits, 'name'),
  }
}

const addToCollection = (effect: TEffects, collection: TEntry[]): void => {
  const existingIdx = collection.findIndex(x => x.name === effect.name)
  if (existingIdx > -1) {
    const existingEntry = { ...collection[existingIdx] }
    const effects = uniqBy([...existingEntry.effects, effect], 'name')
    collection[existingIdx] = { ...existingEntry, effects }
  } else {
    collection.push(effectToEntry(effect))
  }
}

const effectToEntry = (effect: TEffects): TEntry => {
  return {
    name: effect.name,
    effects: [effect],
  }
}
