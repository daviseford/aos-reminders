import { CHAOS_GRAND_ALLIANCE } from 'meta/factions'
import ChaosArtifacts from './artifacts'
import ChaosCommandAbilities from './command_abilities'
import ChaosCommandTraits from './command_traits'
import Units from './units'

const subFactions = {
  [CHAOS_GRAND_ALLIANCE]: {
    effects: [],
    available: {
      artifacts: [ChaosArtifacts],
      command_abilities: [ChaosCommandAbilities],
      command_traits: [ChaosCommandTraits],
      units: [Units],
    },
  },
}

export default subFactions
