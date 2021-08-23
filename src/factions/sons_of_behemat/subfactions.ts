import { SONS_OF_BEHEMAT } from 'meta/factions'
import Artifacts from './artifacts'
import Battalions from './battalions'
import command_abilities from './command_abilities'
import CommandTraits from './command_traits'
import Flavors from './flavors'
import GrandStrategies from './grand_strategies'
import Units from './units'

const subFactions = {
  [SONS_OF_BEHEMAT]: {
    effects: [],

    available: {
      artifacts: [Artifacts],
      battalions: [Battalions],
      command_abilities: [command_abilities],
      command_traits: [CommandTraits],
      grand_strategies: [GrandStrategies],
      flavors: [Flavors],
      units: [Units],
    },
  },
}

export default subFactions
