import { TBattalions, TUnits } from 'types/army'
import LegionsOfNagash from 'army/legions_of_nagash'
import { DURING_GAME, START_OF_HERO_PHASE } from 'types/phases'
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
    name: `The First Cohort`,
    effects: [
      {
        name: `Ceaseless Vigil`,
        desc: `Before you allocate a wound or mortal wound to Nagash, you can pick a friendly Morghast unit from this battalion within 3" of Nagash and roll a D6. On a 3+ the wound or mortal wound is allocated to that unit instead.`,
        when: [DURING_GAME],
      },
      {
        name: `Eternal Servitude`,
        desc: `If Nagash uses his Deathly Invocation ability on any SUMMONABLE unit from the First Cohort, you can treat the D3 result as 3 instead of rolling the dice.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
]
