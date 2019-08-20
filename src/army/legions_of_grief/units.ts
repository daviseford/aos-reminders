import { TBattalions, TUnits } from 'types/army'
import { HERO_PHASE } from 'types/phases'
import Nighthaunt from 'army/nighthaunt'

// Importing Nighthaunt units
const getNighthauntUnits = () => {
  return Nighthaunt.Units
}

// Unit Names things
export const Units: TUnits = [
  ...getNighthauntUnits(),
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
]

// There are no valid Battalions for LoG
export const Battalions: TBattalions = []
