import { GREENSKINZ } from 'meta/factions'
import CommandAbilities from './command_abilities'
import Units from './units'

const subFactions = {
  [GREENSKINZ]: {
    effects: [],
    available: {
      command_abilities: [CommandAbilities],
      units: [Units],
    },
  },
}

export default subFactions
