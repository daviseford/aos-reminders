import { TSubFactions } from 'factions/factionTypes'
import { keyPicker } from '../metatagger'
import Flavors from './flavors'
import Traits from './traits'
import { Units } from './units'

const subFactions: TSubFactions = {
  COALESCED: {
    units: {
      available: [Units],
      mandatory: [],
    },

    // It applies these traits
    traits: {
      available: [],
      mandatory: [keyPicker(Traits, ['Thickly Scaled Hide', 'Cunning'])],
    },

    flavors: {
      available: [keyPicker(Flavors, ["Koatl's Claw", 'Thunder Lizard'])],
      mandatory: [],
    },
  },
  STARBORNE: {
    units: {
      available: [Units],
      mandatory: [],
    },
  },
}

export default subFactions
