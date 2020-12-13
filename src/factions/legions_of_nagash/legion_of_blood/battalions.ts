import { tagAs } from 'factions/metatagger'
import { COMBAT_PHASE, START_OF_MOVEMENT_PHASE } from 'types/phases'

const Battalions = {
  'Court of Nulahmia': {
    effects: [
      {
        name: `The Adevore`,
        desc: `Whilst she is within 9" of this battalion's Bloodseeker Palanquin, you may reroll failed hit rolls for Neferata if the target is an enemy HERO.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Scent of Blood`,
        desc: `At the start of your movement phase, units from the Court of Nulahmia that are within 9" of the battalion's Bloodseeker Palanquin may add 4" to their Move characteristic until the end of the phase.`,
        when: [START_OF_MOVEMENT_PHASE],
      },
    ],
  },
}

// Always export using tagAs
export default tagAs(Battalions, 'battalion')
