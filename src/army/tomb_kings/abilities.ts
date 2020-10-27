import { TAbilities } from 'types/army'
import { WOUND_ALLOCATION_PHASE } from 'types/phases'

// General Allegiance Abilities (always active regardless of army composition)
const Abilities: TAbilities = [
  {
    name: `Deathless Minions`,
    desc: `Each time you allocate a wound or mortal wound to a friendly DEATH model within 6" of your general or a friendly DEATH HERO, roll a D6. On a 6+ the wound is negated.`,
    when: [WOUND_ALLOCATION_PHASE],
  },
]

export default Abilities
