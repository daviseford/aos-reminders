import { TGrandAlliances, CHAOS, DEATH, ORDER, DESTRUCTION } from 'meta/alliances'
import { TArtifacts, TTraits, TUnits } from 'types/army'
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

type IGrandAllianceConfig = {
  readonly [key in TGrandAlliances]: {
    readonly Artifacts: TArtifacts
    readonly Traits: TTraits
    readonly Units: TUnits
  }
}

export const GrandAllianceConfig: IGrandAllianceConfig = {
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
