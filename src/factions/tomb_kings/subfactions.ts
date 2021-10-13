import { TOMB_KINGS } from 'meta/factions'
import Artifacts from './artifacts'
import CommandAbilities from './command_abilities'
import Spells from './spells'
import Units from './units'

const subFactions = {
  [TOMB_KINGS]: {
    effects: [],
    available: {
      artifacts: [Artifacts],
      battalions: [],
      command_abilities: [CommandAbilities],
      spells: [Spells],
      units: [Units],
    },
  },
}

export default subFactions
