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
import { processEffects } from './processEffects'

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
  let { Army, GrandAlliance } = ArmyList[factionName]
  let { Units, Battalions, Traits, Artifacts } = Army

  Army.Artifacts = modifyArtifacts(Artifacts, GrandAlliance)
  Army.Traits = modifyTraits(Traits, GrandAlliance)

  processEffects(Army.Game, [Units, Battalions, Army.Artifacts, Army.Traits])

  return Army
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
 * Modify Artifacts for a given Army
 * @param entry
 */
const modifyArtifacts = (artifacts: TArtifacts, alliance: TGrandAlliances): TArtifacts => {
  const { Artifacts } = GrandAllianceConfig[alliance]
  return sortBy(artifacts, 'name')
    .concat(Artifacts)
    .concat(RealmArtifacts)
}

/**
 * Modify Traits for a given Army
 * @param entry
 */
const modifyTraits = (traits: TCommandTraits, alliance: TGrandAlliances): TCommandTraits => {
  const { Traits } = GrandAllianceConfig[alliance]
  return traits.concat(Traits)
}
