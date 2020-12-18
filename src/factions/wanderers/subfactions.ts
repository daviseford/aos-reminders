import { pickEffects } from 'factions/metatagger'
import { WANDERERS } from 'meta/factions'
import Artifacts from './artifacts'
import Battalions from './battalions'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'
import Spells from './spells'
import Units from './units'

const subFactions = {
  [WANDERERS]: {
    effects: pickEffects(BattleTraits, ['Wanderers']),

    available: {
      artifacts: [Artifacts],
      battalions: [Battalions],
      command_abilities: [CommandAbilities],
      command_traits: [CommandTraits],
      spells: [Spells],
      units: [Units],
    },
  },
}

export default subFactions
