import { WOUND_ALLOCATION } from 'types/phases'
import { TAbilities } from 'types/army'

// General Allegiance Abilities (always active regardless of army composition)
const Abilities: TAbilities = [
  {
    name: `Deathless Minions`,
    desc: `Each time you allocate a wound or mortal wound to a friendly DEATH model within 6" of your general or a friendly DEATH HERO, roll a dice. On a 6+ the wound is negated.`,
    when: [WOUND_ALLOCATION],
  },
]

export default Abilities
