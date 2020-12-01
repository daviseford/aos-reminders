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
import { TArtifacts, TCommandTraits, TUnits } from 'types/army'

type IGrandAllianceConfig = {
  readonly [key in TGrandAlliances]: {
    readonly Artifacts: TArtifacts
    readonly CommandTraits: TCommandTraits
    readonly Units: TUnits
  }
}

export const GrandAllianceConfig: IGrandAllianceConfig = {
  [CHAOS]: {
    Artifacts: ChaosArtifacts,
    CommandTraits: ChaosTraits,
    Units: ChaosUnits,
  },
  [DEATH]: {
    Artifacts: DeathArtifacts,
    CommandTraits: DeathTraits,
    Units: DeathUnits,
  },
  [DESTRUCTION]: {
    Artifacts: DestructionArtifacts,
    CommandTraits: DestructionTraits,
    Units: DestructionUnits,
  },
  [ORDER]: {
    Artifacts: OrderArtifacts,
    CommandTraits: OrderTraits,
    Units: OrderUnits,
  },
}
