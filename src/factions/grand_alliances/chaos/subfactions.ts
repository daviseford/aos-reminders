import { pickEffects } from 'factions/metatagger'
import { CHAOS_GRAND_ALLIANCE } from 'meta/factions'
import ChaosArtifacts from './artifacts'
import BattleTraits from './battle_traits'
import ChaosCommandAbilities from './command_abilities'
import ChaosCommandTraits from './command_traits'
import Units from './units'
import { TItemDescriptions } from 'factions/factionTypes'

const subFactions = {
  [CHAOS_GRAND_ALLIANCE]: {
    effects: pickEffects(BattleTraits, ['Chaos']),
    available: {
      artifacts: [ChaosArtifacts],
      command_abilities: [ChaosCommandAbilities],
      command_traits: [ChaosCommandTraits],
      units: [Units],
    },
  },
} satisfies TItemDescriptions

export default subFactions
