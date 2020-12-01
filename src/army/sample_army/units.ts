import { TUnits } from 'types/army'
// Battalions
import { TEntry } from 'types/data'
import { HERO_PHASE } from 'types/phases'

// Unit Names
export const Units: TUnits = [
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

// Allied units (usually this will involve writing a function to grab units from another army)
// Check out Nurgle or Khorne for good examples
export const AlliedUnits: TUnits = []

export const Battalions: TEntry[] = [
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
