import { TOMB_KINGS } from 'meta/factions'
import CommandAbilities from './command_abilities'
import Spells from './spells'
import Units from './units'
import { TItemDescriptions } from 'factions/factionTypes'

const subFactions = {
  [TOMB_KINGS]: {
    effects: [],
    available: {
      command_abilities: [CommandAbilities],
      spells: [Spells],
      units: [Units],
    },
  },
} satisfies TItemDescriptions

export default subFactions
