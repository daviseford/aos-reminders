import { SONS_OF_BEHEMAT } from 'meta/factions'
import Artifacts from './artifacts'
import command_abilities from './command_abilities'
import CommandTraits from './command_traits'
import Flavors from './flavors'
import Units from './units'

const subFactions = {
  [SONS_OF_BEHEMAT]: {
    effects: [],

    available: {
      artifacts: [Artifacts],
      command_abilities: [command_abilities],
      command_traits: [CommandTraits],
      units: [Units],
      flavors: [Flavors],
    },
  },
}

export default subFactions
