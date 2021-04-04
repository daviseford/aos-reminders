import { pickEffects } from 'factions/metatagger'
import { DESTRUCTION_GRAND_ALLIANCE } from 'meta/factions'
import Artifacts from './artifacts'
import BattleTraits from './battle_traits'
import DestructionCommandAbilities from './command_abilities'
import CommandTraits from './command_traits'
import DestructionUnits from './units'

const subFactions = {
  [DESTRUCTION_GRAND_ALLIANCE]: {
    effects: pickEffects(BattleTraits, ['Destruction']),
    available: {
      artifacts: [Artifacts],
      command_abilities: [DestructionCommandAbilities],
      command_traits: [CommandTraits],
      units: [DestructionUnits],
    },
  },
}

export default subFactions
