import { DESTRUCTION_GRAND_ALLIANCE } from 'meta/factions'
import Artifacts from './artifacts'
import DestructionCommandAbilities from './command_abilities'
import CommandTraits from './command_traits'
import DestructionUnits from './units'

const subFactions = {
  [DESTRUCTION_GRAND_ALLIANCE]: {
    effects: [],
    available: {
      artifacts: [Artifacts],
      command_abilities: [DestructionCommandAbilities],
      command_traits: [CommandTraits],
      units: [DestructionUnits],
    },
  },
}

export default subFactions
