import {
  ChaosArtifacts,
  ChaosTraits,
  ChaosUnits,
  OrderArtifacts,
  OrderTraits,
  OrderUnits,
} from 'army/grand_alliances'
import { DeathFaction, DestructionFaction } from 'factions/grand_alliances'
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
    Artifacts: DeathFaction.AggregateArmy.Artifacts || [],
    CommandTraits: DeathFaction.AggregateArmy.CommandTraits || [],
    Units: DeathFaction.AggregateArmy.Units || [],
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
