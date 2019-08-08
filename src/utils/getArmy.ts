import produce from 'immer'
import { sortBy } from 'lodash'
import { processGame } from './processGame'

import { GenericEndlessSpells, GenericSpells } from 'army/generic/index'
import { RealmArtifacts, RealmSpells } from 'army/malign_sorcery'
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

import { ORDER, DESTRUCTION, TGrandAlliances, CHAOS, DEATH } from 'meta/alliances'
import { ArmyList } from 'meta/army_list'
import { TSupportedFaction, SUPPORTED_FACTIONS } from 'meta/factions'
import { TTraits, TArtifacts, IArmy, TSpells, TEndlessSpells } from 'types/army'
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
  const { Artifacts, Battalions, EndlessSpells, Spells, Traits, Units } = Army
  const { realmscape, GrandAlliance } = meta

  Army.Artifacts = modifyArtifacts(Artifacts, GrandAlliance)
  Army.EndlessSpells = modifyEndlessSpells(EndlessSpells)
  Army.Spells = modifySpells(Spells, realmscape)
  Army.Traits = modifyTraits(Traits, GrandAlliance)
  Army.Game = processGame([
    Army.Allegiances,
    Army.Artifacts,
    Army.EndlessSpells,
    Army.Spells,
    Army.Traits,
    Battalions,
    Units,
  ])

  return Army
})

/**
 * Modify Artifacts for a given Army
 * @param entry
 */
const modifyArtifacts = (artifacts: TArtifacts, alliance: TGrandAlliances): TArtifacts => {
  const { Artifacts } = GrandAllianceConfig[alliance]
  return artifacts
    .concat(Artifacts)
    .concat(RealmArtifacts)
    .map(a => ({ ...a, artifact: true }))
}

/**
 * Modify Traits for a given Army
 * @param entry
 */
const modifyTraits = (traits: TTraits, alliance: TGrandAlliances): TTraits => {
  const { Traits } = GrandAllianceConfig[alliance]
  return traits.concat(Traits).map(t => ({ ...t, command_trait: true }))
}

/**
 * Modify Spells for a given Army
 * @param spells
 * @param realmscape
 */
const modifySpells = (spells: TSpells, realmscape: TRealms | null): TSpells => {
  const realmSpells = realmscape ? RealmSpells.filter(x => x.name.includes(realmscape)) : []
  return spells
    .concat(sortBy(realmSpells, 'name'))
    .concat(GenericSpells)
    .map(s => ({ ...s, spell: true }))
}

/**
 * Modify EndlessSpells for a given Army
 * @param endlessSpells
 */
const modifyEndlessSpells = (endlessSpells: TEndlessSpells): TEndlessSpells => {
  return endlessSpells.concat(sortBy(GenericEndlessSpells, 'name')).map(e => ({ ...e, endless_spell: true }))
}

type IGrandAllianceConfig = {
  readonly [key in TGrandAlliances]: {
    readonly Artifacts: TArtifacts
    readonly Traits: TTraits
  }
}

const GrandAllianceConfig: IGrandAllianceConfig = {
  [ORDER]: {
    Artifacts: OrderArtifacts,
    Traits: OrderTraits,
  },
  [DESTRUCTION]: {
    Artifacts: DestructionArtifacts,
    Traits: DestructionTraits,
  },
  [CHAOS]: {
    Artifacts: ChaosArtifacts,
    Traits: ChaosTraits,
  },
  [DEATH]: {
    Artifacts: DeathArtifacts,
    Traits: DeathTraits,
  },
}
