import { TCommandTraits, TArtifacts, IArmy, TSpells, TEndlessSpells } from 'types/army'
import { TSupportedFaction, SUPPORTED_FACTIONS } from 'meta/factions'
import { ORDER, DESTRUCTION, TGrandAlliances, CHAOS, DEATH } from 'meta/alliances'
import ArmyList from 'meta/army_list'

import { RealmArtifacts, EndlessSpells as RealmEndlessSpells, Spells as RealmSpells } from 'army/malign_sorcery'

import { processGame } from './processGame'
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
import { sortBy } from 'lodash'
import { TRealms } from 'types/realmscapes'

export const getArmy = (factionName: TSupportedFaction | null, realmscape: TRealms | null = null): IArmy | null => {
  if (!SUPPORTED_FACTIONS.includes(factionName as TSupportedFaction)) return null

  const { Army, GrandAlliance } = ArmyList[factionName as TSupportedFaction]
  const { Artifacts, Battalions, EndlessSpells, Spells, Traits, Units } = Army

  Army.Artifacts = modifyArtifacts(Artifacts, GrandAlliance)
  Army.EndlessSpells = modifyEndlessSpells(EndlessSpells)
  Army.Spells = modifySpells(Spells)
  Army.Traits = modifyTraits(Traits, GrandAlliance)
  Army.Game = processGame([
    Units,
    Battalions,
    Army.Artifacts,
    Army.Traits,
    modifySpells(Spells, realmscape),
    modifyEndlessSpells(EndlessSpells),
  ])

  return Army as IArmy
}

type TGrandAllianceConfig = {
  [key in TGrandAlliances]: {
    Artifacts: TArtifacts
    Traits: TCommandTraits
  }
}

const GrandAllianceConfig: TGrandAllianceConfig = {
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
const modifyTraits = (traits: TCommandTraits, alliance: TGrandAlliances): TCommandTraits => {
  const { Traits } = GrandAllianceConfig[alliance]
  return traits.concat(Traits).map(t => ({ ...t, command_trait: true }))
}

const modifySpells = (spells: TSpells = [], realmscape: TRealms | null = null): TSpells => {
  const realmSpells = realmscape ? RealmSpells.filter(x => x.name.includes(realmscape)) : []
  return spells.concat(sortBy(realmSpells, 'name')).map(s => ({ ...s, spell: true }))
}

const modifyEndlessSpells = (endlessSpells: TEndlessSpells = []): TEndlessSpells => {
  return endlessSpells.concat(sortBy(RealmEndlessSpells, 'name')).map(e => ({ ...e, endless_spell: true }))
}
