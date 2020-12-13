import { keyPicker } from 'factions/metatagger'
import { mergeParentEffectObjs } from 'factions/temporaryAdapter'
import { ChaosFaction } from './chaos'
import ChaosArtifacts from './chaos/artifacts'
import ChaosTraits from './chaos/command_traits'
import ChaosUnits from './chaos/units'
import { DeathFaction } from './death'
import DeathArtifacts from './death/artifacts'
import DeathTraits from './death/command_traits'
import DeathUnits from './death/units'
import { DestructionFaction } from './destruction'
import DestructionArtifacts from './destruction/artifacts'
import DestructionTraits from './destruction/command_traits'
import DestructionUnits from './destruction/units'
import { OrderFaction } from './order'
import OrderArtifacts from './order/artifacts'
import OrderTraits from './order/command_traits'
import OrderUnits from './order/units'

// Available to ALL factions in this Grand Alliance
const AvailableOrderUnits = mergeParentEffectObjs([keyPicker(OrderUnits, ['Gotrek Gurnisson'])])
const AvailableDestructionUnits = mergeParentEffectObjs([{ ...DestructionUnits }])
const AvailableDeathUnits = mergeParentEffectObjs([{}])
const AvailableChaosUnits = mergeParentEffectObjs([{}])

export {
  AvailableChaosUnits,
  AvailableDeathUnits,
  AvailableDestructionUnits,
  AvailableOrderUnits,
  ChaosArtifacts,
  ChaosFaction,
  ChaosTraits,
  ChaosUnits,
  DeathArtifacts,
  DeathFaction,
  DeathTraits,
  DeathUnits,
  DestructionArtifacts,
  DestructionFaction,
  DestructionTraits,
  DestructionUnits,
  OrderArtifacts,
  OrderFaction,
  OrderTraits,
  OrderUnits,
}
