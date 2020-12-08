import {
  ChaosArtifacts,
  ChaosTraits,
  ChaosUnits,
  DeathArtifacts,
  DeathTraits,
  DeathUnits,
  OrderArtifacts,
  OrderTraits,
  OrderUnits,
} from 'army/grand_alliances'
import { DestructionFaction } from 'factions/grand_alliances'
import { CHAOS, DEATH, DESTRUCTION, ORDER, TGrandAlliances } from 'meta/alliances'
import { IArmy } from 'types/army'

type IGrandAllianceConfig = Record<TGrandAlliances, Pick<IArmy, 'Artifacts' | 'CommandTraits' | 'Units'>>

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
    Artifacts: DestructionFaction.AggregateArmy.Artifacts || [],
    CommandTraits: DestructionFaction.AggregateArmy.CommandTraits || [],
    Units: DestructionFaction.AggregateArmy.Units || [],
  },
  [ORDER]: {
    Artifacts: OrderArtifacts,
    CommandTraits: OrderTraits,
    Units: OrderUnits,
  },
}
