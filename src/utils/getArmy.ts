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
import { CHAOS, DEATH, DESTRUCTION, ORDER, TGrandAlliances } from 'meta/alliances'
import { ArmyList } from 'meta/army_list'
import { TSupportedFaction, SUPPORTED_FACTIONS } from 'meta/factions'
import {
  IArmy,
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
  TAbilities,
  IInitialArmy,
  ICollection,
} from 'types/army'
import { TRealms } from 'types/realmscapes'
import { TEffects, TEntry } from 'types/data'

export const getArmy = (
  factionName: TSupportedFaction | null,
  realmscape: TRealms | null = null
): IArmy | null => {
  if (!factionName || !SUPPORTED_FACTIONS.includes(factionName as TSupportedFaction)) return null

  const { Army, GrandAlliance } = ArmyList[factionName]
  const Collection = getCollection(Army)

  const army = modifyArmy(Army, { realmscape, GrandAlliance, Collection })

  return army
}

interface IModifyArmyMeta {
  Collection: ICollection
  GrandAlliance: TGrandAlliances
  realmscape: TRealms | null
}

const modifyArmy = produce((Army: IArmy, meta: IModifyArmyMeta) => {
  const {
    Allegiances = [],
    Artifacts = [],
    Battalions = [],
    EndlessSpells = [],
    Scenery = [],
    Spells = [],
    Traits = [],
    Units = [],
  } = Army
  const { realmscape, GrandAlliance, Collection } = meta

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
  // TODO implement Abilities above

  return Army
})

const modifyAllegiances = (allegiances: TAllegiances): TAllegiances => sortBy(allegiances, 'name')
const modifyBattalions = (battalions: TBattalions): TBattalions => sortBy(battalions, 'name')

const modifyUnits = (units: TUnits, alliance: TGrandAlliances): TUnits => {
  const { Units } = GrandAllianceConfig[alliance]
  return units.concat(sortBy(Units, 'name')).map(u => ({ ...u, unit: true }))
}

const modifyArtifacts = (
  artifacts: TArtifacts,
  alliance: TGrandAlliances,
  Collection: ICollection
): TArtifacts => {
  const { Artifacts } = GrandAllianceConfig[alliance]
  return artifacts
    .concat(Collection.Artifacts)
    .concat(Artifacts)
    .concat(RealmArtifacts)
    .map(a => ({ ...a, artifact: true }))
}

const modifyTraits = (traits: TTraits, alliance: TGrandAlliances, Collection: ICollection): TTraits => {
  const { Traits } = GrandAllianceConfig[alliance]
  return traits
    .concat(Collection.Traits)
    .concat(Traits)
    .map(t => ({ ...t, command_trait: true }))
}

const modifyCommands = (realmscape: TRealms | null, Collection: ICollection): TCommands => {
  const realmCommands = realmscape ? RealmscapeCommands.filter(c => c.name.includes(realmscape)) : []
  return Collection.Commands.concat(sortBy(GenericCommands, 'name'))
    .concat(sortBy(realmCommands, 'name'))
    .map(c => ({ ...c, command_ability: true }))
}

const getTriumphs = (): TTriumphs => {
  return sortBy(GenericTriumphs, 'name').map(t => ({ ...t, triumph: true }))
}

const modifySpells = (spells: TSpells, realmscape: TRealms | null, Collection: ICollection): TSpells => {
  const realmSpells = realmscape ? RealmscapeSpells.filter(s => s.name.includes(realmscape)) : []
  return sortBy(spells, 'name')
    .concat(Collection.Spells)
    .concat(sortBy(realmSpells, 'name'))
    .concat(sortBy(GenericSpells, 'name'))
    .map(s => ({ ...s, spell: true }))
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

const getCollection = (army: IInitialArmy): ICollection => {
  const { Allegiances = [], Artifacts = [], Battalions = [], Scenery = [], Traits = [], Units = [] } = army

  const Collection = {
    Abilities: [] as TAbilities,
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
        } else if (effect.allegiance_ability) {
          Collection.Abilities.push(effect)
        }
      })
    })
  )

  console.log(Collection)

  debugger

  return {
    // Abilities can share names, so we have to check descriptions
    Abilities: sortBy(uniqBy(Collection.Abilities, 'desc'), 'name'),
    // The others can't, so it's safe to use uniqBy this way
    Artifacts: sortBy(uniqBy(Collection.Artifacts, 'name'), 'name'),
    Battalions: sortBy(uniqBy(Collection.Battalions, 'name'), 'name'),
    Commands: sortBy(uniqBy(Collection.Commands, 'name'), 'name'),
    Spells: sortBy(uniqBy(Collection.Spells, 'name'), 'name'),
    Traits: sortBy(uniqBy(Collection.Traits, 'name'), 'name'),
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
