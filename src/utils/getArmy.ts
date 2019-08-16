import produce from 'immer'
import { sortBy } from 'lodash'
import { processGame } from './processGame'

import {
  GenericEndlessSpells,
  GenericSpells,
  GenericScenery,
  RealmArtifacts,
  RealmscapeSpells,
} from 'army/generic'

import {
  ChaosArtifacts,
  ChaosTraits,
  DeathArtifacts,
  DeathTraits,
  DestructionArtifacts,
  DestructionTraits,
  OrderArtifacts,
  OrderTraits,
} from 'army/grand_alliances'

import { CHAOS, DEATH, DESTRUCTION, ORDER, TGrandAlliances } from 'meta/alliances'
import { ArmyList } from 'meta/army_list'
import { TSupportedFaction, SUPPORTED_FACTIONS } from 'meta/factions'
import {
  IArmy,
  TAllegiances,
  TArtifacts,
  TBattalions,
  TEndlessSpells,
  TScenery,
  TSpells,
  TTraits,
  TUnits,
} from 'types/army'
import { TRealms } from 'types/realmscapes'

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
  const { Allegiances, Artifacts, Battalions, EndlessSpells, Scenery, Spells, Traits, Units } = Army
  const { realmscape, GrandAlliance } = meta

  Army.Allegiances = modifyAllegiances(Allegiances)
  Army.Artifacts = modifyArtifacts(Artifacts, GrandAlliance)
  Army.Battalions = modifyBattalions(Battalions)
  Army.EndlessSpells = modifyEndlessSpells(EndlessSpells)
  Army.Scenery = modifyScenery(Scenery)
  Army.Spells = modifySpells(Spells, realmscape)
  Army.Traits = modifyTraits(Traits, GrandAlliance)
  Army.Units = modifyUnits(Units)
  Army.Game = processGame([
    Army.Allegiances,
    Army.Artifacts,
    Army.Battalions,
    Army.EndlessSpells,
    Army.Scenery,
    Army.Spells,
    Army.Traits,
    Army.Units,
  ])

  return Army
})

const modifyAllegiances = (allegiances: TAllegiances): TAllegiances => sortBy(allegiances, 'name')
const modifyBattalions = (battalions: TBattalions): TBattalions => sortBy(battalions, 'name')
const modifyUnits = (units: TUnits): TUnits => sortBy(units, 'name')

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

const modifySpells = (spells: TSpells, realmscape: TRealms | null): TSpells => {
  const realmSpells = realmscape ? RealmscapeSpells.filter(x => x.name.includes(realmscape)) : []
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
  }
}

const GrandAllianceConfig: IGrandAllianceConfig = {
  [CHAOS]: {
    Artifacts: ChaosArtifacts,
    Traits: ChaosTraits,
  },
  [DEATH]: {
    Artifacts: DeathArtifacts,
    Traits: DeathTraits,
  },
  [DESTRUCTION]: {
    Artifacts: DestructionArtifacts,
    Traits: DestructionTraits,
  },
  [ORDER]: {
    Artifacts: OrderArtifacts,
    Traits: OrderTraits,
  },
}
