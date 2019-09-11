import { TBattalions, TUnits } from 'types/army'
import LegionsOfNagash from 'army/legions_of_nagash'
import { COMBAT_PHASE, START_OF_HERO_PHASE } from 'types/phases'
import { filterBattalions } from 'utils/filterUtils'

// Importing from LoN
const getLegionsOfNagashUnits = () => LegionsOfNagash.Units
const getLegionsOfNagashBattalions = () => {
  return filterBattalions(LegionsOfNagash.Battalions, [`Deathmarch`, `Castellans of the Crimson Keep`])
}

// Unit Names
export const Units: TUnits = [...getLegionsOfNagashUnits()]

// Battalions
export const Battalions: TBattalions = [
  ...getLegionsOfNagashBattalions(),
  {
    name: `Nightfall Pack`,
    effects: [
      {
        name: `Swooping Predators`,
        desc: `On any turn in which they completed a successful charge move, add 1 to the Attacks characteristic of the Murderous Fangs and Talons of this battalion's Vargheists.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Call of the Night`,
        desc: `If Mannfred uses his Deathly Invocation ability on any Skeleton Warriors unit from the Nightfall Pack, you may re-roll the D3 result for that unit.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
]
