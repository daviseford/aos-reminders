import { tagAs } from 'factions/metatagger'
import { COMBAT_PHASE, START_OF_HERO_PHASE } from 'types/phases'

const Battalions = {
  'Nightfall Pack': {
    effects: [
      {
        name: `Swooping Predators`,
        desc: `On any turn in which they completed a successful charge move, add 1 to the Attacks characteristic of the Murderous Fangs and Talons of this battalion's Vargheists.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Call of the Night`,
        desc: `If Mannfred uses his Deathly Invocation ability on any Skeleton Warriors unit from the Nightfall Pack, you may reroll the D3 result for that unit.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
}

// Always export using tagAs
export default tagAs(Battalions, 'battalion')
