import { WANDERERS } from 'meta/factions'
import Artifacts from './artifacts'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'
import Spells from './spells'
import Units from './units'

const subFactions = {
  [WANDERERS]: {
    effects: [],

    available: {
      artifacts: [Artifacts],
      battalions: [],
      command_abilities: [CommandAbilities],
      command_traits: [CommandTraits],
      spells: [Spells],
      units: [Units],
    },
  },
}

export default subFactions
