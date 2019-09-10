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
} from 'types/army'
import { TRealms } from 'types/realmscapes'
import { TEffects, TEntry } from 'types/data'

export const getArmy = (
  factionName: TSupportedFaction | null,
  realmscape: TRealms | null = null
): IArmy | null => {
  if (!factionName || !SUPPORTED_FACTIONS.includes(factionName as TSupportedFaction)) return null

  const { Army, GrandAlliance } = ArmyList[factionName]
  const army = modifyArmy(Army, { realmscape, GrandAlliance })

  return army
}

interface IModifyArmyMeta {
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
  const { realmscape, GrandAlliance } = meta

  getCollection(Army)

  Army.Allegiances = modifyAllegiances(Allegiances)
  Army.Artifacts = modifyArtifacts(Artifacts, GrandAlliance)
  Army.Battalions = modifyBattalions(Battalions)
  Army.Commands = modifyCommands(realmscape)
  Army.EndlessSpells = modifyEndlessSpells(EndlessSpells)
  Army.Scenery = modifyScenery(Scenery)
  Army.Spells = modifySpells(Spells, realmscape)
  Army.Traits = modifyTraits(Traits, GrandAlliance)
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
  return units.concat(sortBy(Units, 'name')).map(u => ({ ...u, unit: true }))
}

const modifyArtifacts = (artifacts: TArtifacts, alliance: TGrandAlliances): TArtifacts => {
  const { Artifacts } = GrandAllianceConfig[alliance]
  return artifacts
    .concat(Artifacts)
    .concat(RealmArtifacts)
    .map(a => ({ ...a, artifact: true }))
}

const modifyTraits = (traits: TTraits, alliance: TGrandAlliances): TTraits => {
  const { Traits } = GrandAllianceConfig[alliance]
  return traits.concat(Traits).map(t => ({ ...t, command_trait: true }))
}

const modifyCommands = (realmscape: TRealms | null): TCommands => {
  const realmCommands = realmscape ? RealmscapeCommands.filter(c => c.name.includes(realmscape)) : []
  return sortBy(GenericCommands, 'name')
    .concat(sortBy(realmCommands, 'name'))
    .map(c => ({ ...c, command_ability: true }))
}

const getTriumphs = (): TTriumphs => {
  return sortBy(GenericTriumphs, 'name').map(t => ({ ...t, triumph: true }))
}

const modifySpells = (spells: TSpells, realmscape: TRealms | null): TSpells => {
  const realmSpells = realmscape ? RealmscapeSpells.filter(s => s.name.includes(realmscape)) : []
  return sortBy(spells, 'name')
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

interface ICollection {
  Abilities: TAbilities
  Allegiances: TAllegiances
  Artifacts: TArtifacts
  Battalions: TBattalions
  Spells: TSpells
  Traits: TTraits
}

const getCollection = (army: IArmy): ICollection => {
  const { Allegiances = [], Artifacts = [], Battalions = [], Scenery = [], Traits = [], Units = [] } = army

  const Collection = {
    Abilities: [] as TAbilities,
    Allegiances: [] as TAllegiances,
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
    Abilities: uniqBy(Collection.Abilities, 'desc'), // Abilities can share names!
    Allegiances: uniqBy(Collection.Allegiances, 'name'),
    Artifacts: uniqBy(Collection.Artifacts, 'name'),
    Battalions: uniqBy(Collection.Battalions, 'name'),
    Spells: uniqBy(Collection.Spells, 'name'),
    Traits: uniqBy(Collection.Traits, 'name'),
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
