import { TSubFactions } from 'factions/factionTypes'
import { keyPicker, pickEffects } from '../metatagger'
import { SeraphonBattleTraits } from './battle_traits'
import CommandTraits from './command_traits'
import Flavors from './flavors'
import { Units } from './units'

const subFactions: TSubFactions = {
  COALESCED: {
    effects: pickEffects(SeraphonBattleTraits, ['COALESCED']),
    units: {
      available: [Units],
      mandatory: [],
    },

    command_traits: {
      available: [CommandTraits],
      mandatory: [],
    },

    flavors: {
      available: [keyPicker(Flavors, ["Koatl's Claw", 'Thunder Lizard'])],
      mandatory: [],
    },
  },

  // Starborne Constellation
  STARBORNE: {
    effects: pickEffects(SeraphonBattleTraits, ['STARBORNE']),
    units: {
      available: [Units],
      mandatory: [],
    },

    command_traits: {
      available: [CommandTraits],
      mandatory: [],
    },

    flavors: {
      available: [keyPicker(Flavors, ["Dracothion's Tail", 'Fangs of Sotek'])],
      mandatory: [],
    },
  },
}

export default subFactions
