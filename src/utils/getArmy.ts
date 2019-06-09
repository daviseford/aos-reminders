import { IArmy, TCommandTraits, TArtifacts } from 'types/army'
import {
  TSupportedFaction,
  BEASTCLAW_RAIDERS,
  GLOOMSPITE_GITZ,
  IDONETH_DEEPKIN,
  IRONJAWZ,
  SERAPHON,
  SYLVANETH,
} from 'meta/factions'
import { ORDER, DESTRUCTION, TGrandAlliances, CHAOS, DEATH } from 'meta/alliances'

import * as BeastclawRaiders from '../army/beastclaw_raiders'
import * as GloomspiteGitz from '../army/gloomspite'
import * as IdonethDeepkin from '../army/idoneth'
import * as Ironjawz from '../army/ironjawz'
import * as Seraphon from '../army/seraphon'
import * as Sylvaneth from '../army/sylvaneth'
import { OrderTraits, OrderArtifacts } from 'army/order'
import { DestructionArtifacts, DestructionTraits } from 'army/destruction'
import { ChaosTraits, ChaosArtifacts } from 'army/chaos'
import { DeathArtifacts, DeathTraits } from 'army/death'
import { RealmArtifacts } from 'army/malign_sorcery'
import { sortBy } from 'lodash'

const ArmyList: TArmyList = {
  [BEASTCLAW_RAIDERS]: {
    Army: { ...BeastclawRaiders },
    GrandAlliance: DESTRUCTION,
  },
  [GLOOMSPITE_GITZ]: {
    Army: { ...GloomspiteGitz },
    GrandAlliance: DESTRUCTION,
  },
  [IDONETH_DEEPKIN]: {
    Army: { ...IdonethDeepkin },
    GrandAlliance: ORDER,
  },
  [IRONJAWZ]: {
    Army: { ...Ironjawz },
    GrandAlliance: DESTRUCTION,
  },
  [SERAPHON]: {
    Army: { ...Seraphon },
    GrandAlliance: ORDER,
  },
  [SYLVANETH]: {
    Army: { ...Sylvaneth },
    GrandAlliance: ORDER,
  },
}

export const getArmy = (factionName: TSupportedFaction): IArmy => {
  let entry = ArmyList[factionName]

  entry = sortArtifacts(entry)
  entry = addAllianceArtifacts(entry)
  entry = addAllianceTraits(entry)
  entry = addRealmArtifacts(entry)

  return entry.Army
}

type TArmyList = { [factionName in TSupportedFaction]: IArmyListEntry }

interface IArmyListEntry {
  Army: IArmy
  GrandAlliance: TGrandAlliances
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
 * Sort the initial Artifacts array by name
 * @param entry
 */
const sortArtifacts = (entry: IArmyListEntry): IArmyListEntry => {
  entry.Army.Artifacts = sortBy(entry.Army.Artifacts, 'name')
  return entry
}

/**
 * Attach Realm Artifacts
 * @param entry
 */
const addRealmArtifacts = (entry: IArmyListEntry): IArmyListEntry => {
  entry.Army.Artifacts = entry.Army.Artifacts.concat(RealmArtifacts)
  return entry
}

/**
 * Attach Alliance artifacts
 * @param entry
 */
const addAllianceArtifacts = (entry: IArmyListEntry): IArmyListEntry => {
  const { Artifacts } = GrandAllianceConfig[entry.GrandAlliance]
  entry.Army.Artifacts = entry.Army.Artifacts.concat(Artifacts)
  return entry
}

/**
 * Attach Alliance traits
 * @param entry
 */
const addAllianceTraits = (entry: IArmyListEntry): IArmyListEntry => {
  const { Traits } = GrandAllianceConfig[entry.GrandAlliance]
  entry.Army.Traits = entry.Army.Traits.concat(Traits)
  return entry
}
