import { GREENSKINZ } from 'meta/factions'
import CommandAbilities from './command_abilities'
import Units from './units'
import { TItemDescriptions } from 'factions/factionTypes'

const subFactions = {
  [GREENSKINZ]: {
    effects: [],
    available: {
      command_abilities: [CommandAbilities],
      units: [Units],
    },
  },
} satisfies TItemDescriptions

export default subFactions
