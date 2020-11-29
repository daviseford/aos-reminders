import { keyPicker } from '../metatagger'
import Flavors from './flavors'
import Traits from './traits'
import { Units } from './units'

const subFactions = {
  COALESCED: {
    units: [Units],

    // It applies these traits
    traits: keyPicker(Traits, ['Thickly Scaled Hide', 'Cunning']),

    flavors: keyPicker(Flavors, ["Koatl's Claw", 'Thunder Lizard']),
  },
  STARBORNE: {
    units: [Units],
  },
}

export default subFactions
