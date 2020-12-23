import { DISPOSSESSED } from 'meta/factions'
import { pickEffects } from '../metatagger'
import Artifacts from './artifacts'
import Battalions from './battalions'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'
import Units from './units'

const subFactions = {
  [DISPOSSESSED]: {
    effects: pickEffects(BattleTraits, ['Grudgebound', 'Stubborn to the End']),
    available: {
      artifacts: [Artifacts],
      battalions: [Battalions],
      command_abilities: [CommandAbilities],
      command_traits: [CommandTraits],
      units: [Units],
    },
  },
}

export default subFactions
