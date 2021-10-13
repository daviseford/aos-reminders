import { pickEffects } from 'factions/metatagger'
import { ORDER_GRAND_ALLIANCE } from 'meta/factions'
import Artifacts from './artifacts'
import BattleTraits from './battle_traits'
import CommandTraits from './command_traits'
import Units from './units'

const subFactions = {
  [ORDER_GRAND_ALLIANCE]: {
    effects: pickEffects(BattleTraits, ['Order']),
    available: {
      artifacts: [Artifacts],
      command_traits: [CommandTraits],
      units: [Units],
    },
  },
}

export default subFactions
