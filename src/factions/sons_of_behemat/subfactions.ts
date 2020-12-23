import { pickEffects } from 'factions/metatagger'
import { SONS_OF_BEHEMAT } from 'meta/factions'
import Artifacts from './artifacts'
import battle_traits from './battle_traits'
import command_abilities from './command_abilities'
import CommandTraits from './command_traits'
import Flavors from './flavors'
import Units from './units'

const subFactions = {
  [SONS_OF_BEHEMAT]: {
    effects: pickEffects(battle_traits, ['Sons of Behemat']),

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
