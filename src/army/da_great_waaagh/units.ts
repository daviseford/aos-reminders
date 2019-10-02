import { TBattalions, TUnits } from 'types/army'
import { HERO_PHASE } from 'types/phases'
import Bonesplitterz from 'army/bonesplitterz'
import Ironjawz from 'army/ironjawz'

// Importing Ironjawz
const getIronjawzUnits = () => Ironjawz.Units

// Importing Bonesplitterz
const getBonesplitterz = () => Bonesplitterz.Units

// Exporting the units
export const Units: TUnits = [...getIronjawzUnits(), ...getBonesplitterz()]

// Battalions
export const Battalions: TBattalions = [
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
