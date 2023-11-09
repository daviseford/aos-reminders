import { SONS_OF_BEHEMAT } from 'meta/factions'
import Artifacts from './artifacts'
import Battalions from './battalions'
import CommandTraits from './command_traits'
import Flavors from './flavors'
import GrandStrategies from './grand_strategies'
import Units from './units'
import { keyOmitter, keyPicker, pickEffects } from 'factions/metatagger'
import battle_traits from './battle_traits'

const subFactions = {
  'Sons Of Behemat': {
    effects: pickEffects(battle_traits, [SONS_OF_BEHEMAT, 'Battle Tactics', 'Monstrous Rampages']),

    available: {
      artifacts: [keyOmitter(Artifacts, ['Brand of the Gargant King', 'Lucky Shiny Hat', 'Crafty Creepers'])],
      battalions: [Battalions],
      command_traits: [keyOmitter(CommandTraits, ['High Expectations', 'Big Eater', 'Loud-mouthed Bully'])],
      grand_strategies: [keyOmitter(GrandStrategies, ['Flatten the Lands'])],
      flavors: [Flavors],
      units: [Units],
    },
  },

  "King Brodd's Stomp": {
    effects: pickEffects(battle_traits, [
      "King Brodd's Stomp",
      "King Brodd's Stomp Battle Tactics",
      'Monstrous Rampages',
    ]),

    available: {
      artifacts: [keyPicker(Artifacts, ['Brand of the Gargant King', 'Lucky Shiny Hat', 'Crafty Creepers'])],
      battalions: [Battalions],
      command_traits: [keyPicker(CommandTraits, ['High Expectations', 'Big Eater', 'Loud-mouthed Bully'])],
      grand_strategies: [keyPicker(GrandStrategies, ['Flatten the Lands'])],
      flavors: [],
      units: [Units],
    },
  },
}

export default subFactions
