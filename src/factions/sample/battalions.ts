import { keyPicker, tagAs } from 'factions/metatagger'
import { END_OF_CHARGE_PHASE, HERO_PHASE } from 'types/phases'
import Units from './units'

const RegularBattalions = {
  // The name that you enter here is how it'll appear on the UI
  'Regular Battalion 1': {
    effects: [
      {
        name: `First Effect from Regular Battalion 1`,
        desc: `In your hero phase, etc.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Regular Battalion 2': {
    mandatory: {
      units: [keyPicker(Units, ['Simple Hero'])],
    },
    effects: [],
  },
}

const SuperBattalions = {
  'Super Battalion': {
    mandatory: {
      // This battalion requires these two battalions to be a part of it.
      battalions: [keyPicker(RegularBattalions, ['Regular Battalion 1', 'Regular Battalion 2'])],
    },
    effects: [
      {
        name: `First Effect from Super Battalion`,
        desc: `etc etc.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
}

// Merge the Battalions
const Battalions = { ...RegularBattalions, ...SuperBattalions }

// Always export using tagAs
export default tagAs(Battalions, 'battalion')
