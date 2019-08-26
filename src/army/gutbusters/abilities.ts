import { HERO_PHASE } from 'types/phases'
import { TAbilities } from 'types/army'

// These Are The General Allegiance Abilities From Destruction
const Abilities: TAbilities = [
  {
    name: `Rampaging Destroyers`,
    desc: `Roll a D6 for your general and each friendly DESTRUCTION HERO on the battlefield. General gets +2 to roll. On a 6+ pick a friendly DESTRUCTION unit within 6" of the general or HERO being rolled for. That unit can either:
    
    - Immediately move 6" if it is  more than 12" from the enemy
    - Immediately pile in if within 3" of the enemy, or
    - Declare a charge in any other circumstances`,
    when: [HERO_PHASE],
  },
]

export default Abilities
