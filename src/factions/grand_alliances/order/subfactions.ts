import { ORDER_GRAND_ALLIANCE } from 'meta/factions'
import Artifacts from './artifacts'
import CommandTraits from './command_traits'
import Units from './units'

const subFactions = {
  [ORDER_GRAND_ALLIANCE]: {
    effects: [],
    available: {
      artifacts: [Artifacts],
      command_traits: [CommandTraits],
      units: [Units],
    },
  },
}

export default subFactions
