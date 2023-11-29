import { WANDERERS } from 'meta/factions'
import Artifacts from './artifacts'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'
import Spells from './spells'
import Units from './units'
import { TItemDescriptions } from 'factions/factionTypes'

const subFactions = {
  [WANDERERS]: {
    effects: [],

    available: {
      artifacts: [Artifacts],
      command_abilities: [CommandAbilities],
      command_traits: [CommandTraits],
      spells: [Spells],
      units: [Units],
    },
  },
} satisfies TItemDescriptions

export default subFactions
