import { TSubFactions } from 'factions/factionTypes'
import { keyPicker, pickEffects } from '../metatagger'
import { SeraphonBattleTraits } from './battle_traits'
import Flavors from './flavors'
import Traits from './traits'
import { Units } from './units'

const subFactions: TSubFactions = {
  COALESCED: {
    effects: pickEffects(SeraphonBattleTraits, ['COALESCED']),
    units: {
      available: [Units],
      mandatory: [],
    },

    // It applies these traits
    command_traits: {
      available: [],
      mandatory: [keyPicker(Traits, ['Thickly Scaled Hide', 'Cunning'])],
    },

    flavors: {
      available: [keyPicker(Flavors, ["Koatl's Claw", 'Thunder Lizard'])],
      mandatory: [],
    },
  },
  STARBORNE: {
    effects: [],
    units: {
      available: [Units],
      mandatory: [],
    },
  },
}

export default subFactions
