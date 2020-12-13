import { tagAs } from 'factions/metatagger'
import { START_OF_HERO_PHASE, WOUND_ALLOCATION_PHASE } from 'types/phases'

const Battalions = {
  'The First Cohort': {
    effects: [
      {
        name: `Ceaseless Vigil`,
        desc: `Before you allocate a wound or mortal wound to Nagash, you can pick a friendly Morghast unit from this battalion within 3" of Nagash and roll a D6. On a 3+ the wound or mortal wound is allocated to that unit instead.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Eternal Servitude`,
        desc: `If Nagash uses his Deathly Invocation ability on any SUMMONABLE unit from the First Cohort, you can treat the D3 result as 3 instead of rolling the dice.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
}

// Always export using tagAs
export default tagAs(Battalions, 'battalion')
