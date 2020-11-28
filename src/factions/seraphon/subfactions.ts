import { keyOmitter, keyPicker } from './metatagger'
import { Units } from './units'
const subFactions = {
  COALESCED: {
    units: {},
  },

  // Example structure of a subfaction, imagine this repeated for traits, spells, etc
  STARBORNE: {
    units: {
      all: keyOmitter(Units, 'Lord Kroak'), // Let;s pretend we can't have Lord Kroak
      mandatory: keyPicker(Units, 'Bastiladon'), // pretend we need a bastiladon
      not_allowed: keyPicker(Units, 'Saurus Warriors', 'Skinks'), // and pretend we can't have a saurus gaurd oor skinks
    },
  },
}

export default subFactions
