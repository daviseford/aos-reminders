import { BATTLESHOCK_PHASE } from 'types/phases'
import Flavors from './flavors'
import { keyPicker } from './metatagger'
import Traits from './traits'
import { Units } from './units'

const subFactions = {
  COALESCED: {},
  STARBORNE: {},

  // Example structure of a subfaction, imagine this repeated for traits, spells, etc
  MADE_UP: {
    // Let's pretend this subfaction mandates that you take a Skink Priest + Trog
    units: keyPicker(Units, 'Skink Priest', 'Skink Oracle on Troglodon'),

    // It applies these traits
    traits: keyPicker(Traits, 'Thickly Scaled Hide', 'Cunning'),

    // And it enables either of these two flavors to be selected in the UI
    flavors: keyPicker(Flavors, 'A Different Flavor', 'Made Up Flavor'),

    // General rules to be added because of this subfaction being selected
    effects: [
      {
        name: `Cold-blooded`,
        desc: `Ignore modifiers (positive or negative) to the Bravery characteristic of MADE_UP units.`,
        when: [BATTLESHOCK_PHASE],
      },
      // etc
    ],
  },
}

// subFactions.MADE_UP.units.
export default subFactions
